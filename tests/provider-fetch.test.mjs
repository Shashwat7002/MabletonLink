import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {providerFetch} from '../server/provider-fetch.mjs';

test('provider redirects are returned without forwarding the credential to their destination', async () => {
  let redirectedRequests = 0;
  const server = createServer((req, res) => {
    if (req.url === '/provider') {res.writeHead(302, {Location: '/unexpected-destination'}); res.end();}
    else {redirectedRequests++; res.end('unexpected');}
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const logs = [];
  try {
    const response = await providerFetch(fetch, message => logs.push(message))(`http://127.0.0.1:${server.address().port}/provider`, {
      method: 'POST', redirect: 'error', headers: {'x-goog-api-key': 'test-key'}, body: 'synthetic question',
    });
    assert.equal(response.status, 302);
    assert.equal(response.ok, false);
    assert.equal(redirectedRequests, 0);
    assert.deepEqual(logs.map(JSON.parse), [{event: 'gemini_upstream_failure', status: 302}]);
  } finally {server.closeAllConnections(); await new Promise(resolve => server.close(resolve));}
});

test('transport diagnostics never include the thrown message, key, URL or question', async () => {
  const logs = [];
  const call = providerFetch(async () => {throw new Error('test-key sensitive-question https://private.example');}, message => logs.push(message));
  await assert.rejects(call('https://example.test', {headers: {'x-goog-api-key': 'test-key'}}));
  assert.deepEqual(logs.map(JSON.parse), [{event: 'gemini_transport_failure', timeout: false}]);
});
