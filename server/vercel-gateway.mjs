// Vercel serves the interface; the existing Worker owns Gemini, D1 and quotas.
// This is a single-purpose gateway, never a user-selectable proxy.
const UPSTREAM = 'https://mabletonlink-launchpad.himanshu-k-cd.chatgpt.site/api/assistant';
const UPSTREAM_ORIGIN = new URL(UPSTREAM).origin;
const JSON_HEADERS = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'};
const unavailable = (code, status = 503, extra = {}) => Response.json({
  status: 'unavailable', code, message: 'The assistant is unavailable right now. You can still use Search services or browse All services.', services: [],
}, {status, headers: {...JSON_HEADERS, ...extra}});

async function boundedText(stream, limit) {
  if (!stream) throw new Error('empty');
  const reader = stream.getReader(); const chunks = []; let size = 0;
  try {
    while (true) {
      const {value, done} = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) {await reader.cancel(); throw new Error('too_large');}
      chunks.push(value);
    }
  } finally {reader.releaseLock();}
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.byteLength;}
  return new TextDecoder('utf-8', {fatal: true}).decode(bytes);
}

export function createGateway(fetchImpl = fetch) {
  return async function handle(request) {
    if (request.method !== 'POST') return unavailable('method', 405, {Allow: 'POST'});
    if (request.headers.get('origin') !== new URL(request.url).origin
      || (request.headers.has('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) return unavailable('origin', 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return unavailable('content_type', 415);
    if (Number(request.headers.get('content-length')) > 8192) return unavailable('request_size', 413);
    let body;
    try {body = await boundedText(request.body, 8192); JSON.parse(body);}
    catch {return unavailable('invalid_request', 400);}
    const headers = {'Content-Type': 'application/json', Origin: UPSTREAM_ORIGIN, 'Sec-Fetch-Site': 'same-origin'};
    // Forward only the signed assistant cookie, never a Vercel/auth cookie or a claimed IP.
    const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)(ml_assistant=[a-f0-9-]+\.[0-9]+\.[a-f0-9]{64})(?:;|$)/);
    if (cookie) headers.Cookie = cookie[1];
    try {
      const response = await fetchImpl(UPSTREAM, {method: 'POST', headers, body,
        redirect: 'error', signal: AbortSignal.timeout(18000)});
      if (!response.headers.get('content-type')?.startsWith('application/json')
        || ![200, 400, 403, 405, 413, 415, 429, 503].includes(response.status)) return unavailable('provider_unavailable');
      const result = JSON.parse(await boundedText(response.body, 32768));
      if (!result || typeof result.status !== 'string' || !Array.isArray(result.services)) return unavailable('unverified_response');
      const outputHeaders = {...JSON_HEADERS};
      const setCookie = response.headers.getSetCookie().find(value => /^ml_assistant=[a-f0-9.-]+; Path=\/api\/assistant; HttpOnly; SameSite=Strict; Max-Age=86400; Secure$/.test(value));
      if (setCookie) outputHeaders['Set-Cookie'] = setCookie;
      const retryAfter = response.headers.get('retry-after');
      if (/^\d{1,6}$/.test(retryAfter || '')) outputHeaders['Retry-After'] = retryAfter;
      return Response.json(result, {status: response.status, headers: outputHeaders});
    } catch {return unavailable('provider_unavailable');}
  };
}
