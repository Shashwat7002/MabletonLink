import {SYSTEM_INSTRUCTION, decisionSchema} from './policy.mjs';
import {routeQuestion} from '../public/routing.mjs';
import {translate} from '../public/i18n.mjs';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const STATUSES = new Set(['match', 'clarify', 'out_of_scope', 'not_found', 'emergency']);
const CLARIFICATIONS = {
  service_type: 'Which local service do you need help with? For example, water, trash, taxes or schools.',
  provider: 'Which provider or agency is shown on your bill or letter? Please share only its name, not your account number.',
  city_limits: 'Does this concern a home inside Mableton city limits? A Mableton mailing address alone does not confirm this. You can check the city district map in All services.',
};
const MESSAGES = {
  match: 'These services may help. Check the provider’s current instructions and whether the service applies to you. I cannot confirm fees, deadlines, eligibility, balances or live service status.',
  out_of_scope: 'I can help you find services for Mableton residents, such as water, trash, schools and city services. What local service do you need?',
  not_found: 'I couldn’t find a clear match in our approved directory. Try naming the service, or use All services to browse by category.',
  emergency: 'If someone is in immediate danger, call 911. MabletonLink cannot contact emergency services or send help.',
};
const UNAVAILABLE = 'The assistant is unavailable right now. You can still use Search services or browse All services.';
const encoder = new TextEncoder();

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', ...extra,
  }});
}
function failure(code, status, message = UNAVAILABLE, extra = {}) {
  return json({status: 'unavailable', code, message, services: []}, status, extra);
}
function exactKeys(value, names) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === names.length && names.every(k => Object.hasOwn(value, k));
}
function validQuestion(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 500;
}
export function validateInput(value, ids) {
  const names = ['question', 'previous_question', 'previous_service_ids'];
  if (value && Object.hasOwn(value, 'locale')) names.push('locale');
  if (!exactKeys(value, names) || (value.locale !== undefined && !['en', 'es'].includes(value.locale))) return null;
  if (!validQuestion(value.question) || typeof value.previous_question !== 'string' || value.previous_question.length > 500) return null;
  if (!Array.isArray(value.previous_service_ids) || value.previous_service_ids.length > 3
    || value.previous_service_ids.some(id => !ids.has(id)) || new Set(value.previous_service_ids).size !== value.previous_service_ids.length) return null;
  return {question: value.question.trim(), previous_question: value.previous_question.trim(), previous_service_ids: value.previous_service_ids, locale: value.locale || 'en'};
}
export function validateDecision(value, ids) {
  if (!exactKeys(value, ['status', 'service_ids', 'clarification_id']) || !STATUSES.has(value.status)) return null;
  if (!Array.isArray(value.service_ids) || value.service_ids.length > 3
    || new Set(value.service_ids).size !== value.service_ids.length || value.service_ids.some(id => !ids.has(id))) return null;
  if (value.status === 'match' ? value.service_ids.length === 0 : value.service_ids.length !== 0) return null;
  if (value.status === 'clarify' ? !Object.hasOwn(CLARIFICATIONS, value.clarification_id) : value.clarification_id !== 'none') return null;
  return value;
}
export function renderDecision(decision, directory, locale = 'en') {
  const entries = new Map(directory.entries.map(e => [e.id, e]));
  return {
    status: decision.status,
    message: locale === 'es' ? translate(decision.status === 'emergency' ? 'emergencyAnswer' : decision.status, locale) : decision.status === 'clarify' ? CLARIFICATIONS[decision.clarification_id] : MESSAGES[decision.status],
    services: decision.service_ids.map(id => {
      const e = entries.get(id);
      return {id: e.id, title: e.title, agency: e.agency, description: e.description,
        applicability: e.applicability, official_url: e.official_url, reviewed_on: e.reviewed_on};
    }),
  };
}
async function boundedJSON(stream, limit) {
  if (!stream) throw new Error('empty');
  const reader = stream.getReader(); const chunks = []; let length = 0;
  try {
    while (true) {
      const {value, done} = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new Error('size'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
}
async function mac(secret, value) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
async function session(request, secret, day) {
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)ml_assistant=([a-f0-9-]+)\.([0-9]+)\.([a-f0-9]{64})(?:;|$)/);
  if (cookie && /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(cookie[1]) && Number(cookie[2]) === day) {
    const expected = await mac(secret, `session:${cookie[1]}.${day}`);
    let difference = 0; for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ cookie[3].charCodeAt(i);
    if (difference === 0) return {id: cookie[1]};
  }
  const id = crypto.randomUUID();
  const signature = await mac(secret, `session:${id}.${day}`);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return {id, cookie: `ml_assistant=${id}.${day}.${signature}; Path=/api/assistant; HttpOnly; SameSite=Strict; Max-Age=86400${secure}`};
}
export const LIMIT_SQL = `INSERT INTO assistant_usage (bucket, count, expires_at) VALUES (?, 1, ?)
  ON CONFLICT(bucket) DO UPDATE SET count = count + 1 RETURNING count`;
export async function reserveUsage(db, {sessionId, ipHash, now, dailyLimit}) {
  const hour = Math.floor(now / 3600000), day = Math.floor(now / 86400000);
  const expiry = now + 2 * 86400000;
  const counts = await db.batch([
    db.prepare(LIMIT_SQL).bind(`session:${hour}:${sessionId}`, expiry),
    db.prepare(LIMIT_SQL).bind(`network:${hour}:${ipHash}`, expiry),
    db.prepare('DELETE FROM assistant_usage WHERE expires_at < ?').bind(now),
  ]);
  if (!counts.every(r => r.success) || !Number.isInteger(counts[0].results?.[0]?.count)
    || !Number.isInteger(counts[1].results?.[0]?.count)) throw new Error('usage_store');
  if (counts[0].results[0].count > 20 || counts[1].results[0].count > 60) return false;
  const global = await db.prepare(LIMIT_SQL).bind(`global:${day}`, expiry).first();
  if (!Number.isInteger(global?.count)) throw new Error('usage_store');
  return global.count <= dailyLimit;
}

export function createAssistant({directory, getEnv, fetchImpl = fetch, now = Date.now}) {
  const records = directory.entries;
  const ids = new Set(records.map(e => e.id));
  if (ids.size !== records.length || records.some(e => !/^https:\/\//.test(e.official_url))) throw new Error('Invalid approved directory');
  const approved = records.map(({id, title, agency, description, applicability, category}) => ({id, title, agency, description, applicability, category}));
  return async function handle(request) {
    if (request.method !== 'POST') return failure('method', 405, 'Please send your question using the assistant form.', {Allow: 'POST'});
    // A CSRF boundary, not authentication. Server-side quotas also apply.
    if (request.headers.get('origin') !== new URL(request.url).origin
      || (request.headers.has('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin')) return failure('origin', 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return failure('content_type', 415);
    if (Number(request.headers.get('content-length')) > 8192) return failure('request_size', 413);
    let input;
    try { input = validateInput(await boundedJSON(request.body, 8192), ids); }
    catch { return failure('invalid_request', 400, 'Please enter a question of up to 500 characters. No personal information is needed.'); }
    if (!input) return failure('invalid_request', 400, 'Please enter a question of up to 500 characters. No personal information is needed.');
    // Deterministic emergency and obvious-sensitive-data checks apply before any third-party request.
    const preliminary = routeQuestion(input.question);
    if (preliminary.status === 'emergency') {
      return json(renderDecision({status: 'emergency', service_ids: [], clarification_id: 'none'}, directory, input.locale));
    }
    if (preliminary.status === 'sensitive' || routeQuestion(input.previous_question).status === 'sensitive') {
      return json({status: 'sensitive', message: translate('sensitive', input.locale), services: []});
    }
    const env = getEnv();
    if (env.ASSISTANT_ENABLED === 'false' || !env.GEMINI_API_KEY || !env.DB) return failure('not_configured', 503);
    const model = env.GEMINI_MODEL || DEFAULT_MODEL;
    if (!/^gemini-[a-zA-Z0-9.-]{1,80}$/.test(model)) return failure('configuration', 503);
    const timestamp = now(); let visitor; let extra = {};
    try {
      const day = Math.floor(timestamp / 86400000);
      visitor = await session(request, env.GEMINI_API_KEY, day);
      if (visitor.cookie) extra['Set-Cookie'] = visitor.cookie;
      // CF-Connecting-IP is platform supplied. Never trust X-Forwarded-For.
      // If the platform omits it, use a shared limited bucket, not unlimited use.
      const ipHash = await mac(env.GEMINI_API_KEY, `network:${day}:${request.headers.get('cf-connecting-ip') || 'unknown'}`);
      const configuredLimit = Number(env.ASSISTANT_DAILY_LIMIT || 200);
      if (!Number.isInteger(configuredLimit) || configuredLimit < 1 || configuredLimit > 5000) return failure('configuration', 503);
      if (!await reserveUsage(env.DB, {sessionId: visitor.id, ipHash, now: timestamp, dailyLimit: configuredLimit})) {
        return failure('rate_limit', 429, 'The assistant has reached its usage limit. Please try later, or use Search services and All services now.', {...extra, 'Retry-After': '3600'});
      }
    } catch { return failure('usage_unavailable', 503); }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST', redirect: 'error', signal: controller.signal,
        headers: {'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY},
        body: JSON.stringify({
          systemInstruction: {parts: [{text: SYSTEM_INSTRUCTION}]},
          contents: [{role: 'user', parts: [{text: JSON.stringify({approved_directory: approved, resident_request: input})}]}],
          generationConfig: {temperature: model === 'gemini-3.1-flash-lite' ? 1 : 0, candidateCount: 1, maxOutputTokens: 1024,
            responseMimeType: 'application/json', responseSchema: decisionSchema(),
            ...(model === 'gemini-3.1-flash-lite' ? {thinkingConfig: {thinkingLevel: 'minimal'}}
              : model.startsWith('gemini-2.5-flash') ? {thinkingConfig: {thinkingBudget: 0}} : {})},
          safetySettings: ['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT']
            .map(category => ({category, threshold: 'BLOCK_MEDIUM_AND_ABOVE'})),
        }),
      });
      if (!response.ok) return failure('provider_unavailable', 503, UNAVAILABLE, extra);
      const result = await boundedJSON(response.body, 32768);
      const candidate = result.candidates?.[0];
      if (result.promptFeedback?.blockReason || result.candidates?.length !== 1 || candidate?.finishReason !== 'STOP'
        || candidate.safetyRatings?.some(r => r.blocked)) return failure('unverified_response', 503, UNAVAILABLE, extra);
      const parts = candidate.content?.parts;
      if (!Array.isArray(parts) || parts.some(p => !p.thought && (typeof p.text !== 'string' || Object.keys(p).some(k => !['text', 'thought', 'thoughtSignature'].includes(k))))) return failure('unverified_response', 503, UNAVAILABLE, extra);
      const text = parts.filter(p => !p.thought).map(p => p.text).join('');
      const decision = validateDecision(JSON.parse(text), ids);
      if (!decision) return failure('unverified_response', 503, UNAVAILABLE, extra);
      return json(renderDecision(decision, directory, input.locale), 200, extra);
    } catch { return failure('provider_unavailable', 503, UNAVAILABLE, extra); }
    finally { clearTimeout(timer); }
  };
}
