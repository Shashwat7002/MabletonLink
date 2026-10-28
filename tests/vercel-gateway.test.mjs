import test from 'node:test';
import assert from 'node:assert/strict';
import {createGateway} from '../server/vercel-gateway.mjs';

const origin = 'https://mabletonlink.vercel.app';
const input = {question: 'Pagar agua', previous_question: '', previous_service_ids: [], locale: 'es'};
const request = (headers = {}, body = JSON.stringify(input)) => new Request(origin + '/api/assistant', {method: 'POST', headers: {Origin: origin, 'Content-Type': 'application/json', 'Sec-Fetch-Site': 'same-origin', ...headers}, body});
const result = {status: 'match', services: [{id: 'pay-a-water-bill'}]};
const cookie = 'ml_assistant=12345678-1234-1234-1234-123456789012.20000.' + 'a'.repeat(64);

test('Vercel gateway sends only the approved body and assistant cookie to the fixed backend', async () => {
  let sent;
  const handle = createGateway(async (url, options) => {sent = {url, ...options}; return Response.json(result, {headers: {'Set-Cookie': cookie + '; Path=/api/assistant; HttpOnly; SameSite=Strict; Max-Age=86400; Secure'}});});
  const response = await handle(request({Cookie: `private_auth=secret; ${cookie}; other=value`, Authorization: 'Bearer private', 'CF-Connecting-IP': '192.0.2.55', 'X-Forwarded-For': '192.0.2.55'}));
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), result);
  assert.equal(sent.url, 'https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site/api/assistant');
  assert.equal(sent.headers.Origin, new URL(sent.url).origin);
  assert.equal(sent.headers.Cookie, cookie); assert.equal(sent.headers.Authorization, undefined);
  assert.equal(sent.headers['CF-Connecting-IP'], undefined); assert.equal(sent.headers['X-Forwarded-For'], undefined);
  assert.equal(sent.redirect, 'error'); assert.deepEqual(JSON.parse(sent.body), input);
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('gateway rejects cross-site, missing-origin, non-JSON and malformed requests without upstream calls', async () => {
  let calls = 0; const handle = createGateway(async () => {calls++; return Response.json(result);});
  for (const headers of [{Origin: 'https://evil.example'}, {Origin: ''}, {'Sec-Fetch-Site': 'cross-site'}]) assert.equal((await handle(request(headers))).status, 403);
  assert.equal((await handle(request({'Content-Type': 'text/plain'}))).status, 415);
  assert.equal((await handle(request({}, 'broken'))).status, 400);
  assert.equal((await handle(request({'Content-Length': '9000'}))).status, 413);
  assert.equal((await handle(request({}, JSON.stringify({question: 'x'.repeat(9000)})))).status, 400);
  assert.equal((await handle(new Request(origin + '/api/assistant'))).status, 405);
  assert.equal(calls, 0);
});
test('gateway preserves upstream quota rejection and safe retry metadata', async () => {
  const handle = createGateway(async () => Response.json({status: 'unavailable', code: 'rate_limit', services: []}, {status: 429, headers: {'Retry-After': '3600'}}));
  const response = await handle(request());
  assert.equal(response.status, 429); assert.equal(response.headers.get('retry-after'), '3600');
  assert.equal((await response.json()).code, 'rate_limit');
});
test('gateway hides upstream HTML, transport failures, malformed JSON and oversized responses', async () => {
  for (const upstream of [async () => {throw new Error('secret');}, async () => new Response('<h1>Login</h1>'), async () => Response.json({secret: 'hidden'}), async () => new Response('x'.repeat(32769), {headers: {'Content-Type': 'application/json'}})]) {
    const response = await createGateway(upstream)(request());
    assert.equal(response.status, 503); assert.equal((await response.json()).status, 'unavailable');
  }
});
