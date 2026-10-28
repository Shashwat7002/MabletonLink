/// <reference types="vite/client" />
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}

declare namespace Cloudflare { interface Env {
 GEMINI_API_KEY?: string;
 GEMINI_MODEL?: string;
 ASSISTANT_DAILY_LIMIT?: string;
 ASSISTANT_ENABLED?: string;
}}
declare module "*?raw" { const content: string; export default content; }
