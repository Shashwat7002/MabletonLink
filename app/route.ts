import html from "../public/index.html?raw";
export const dynamic = "force-dynamic";
export function GET() {
 return new Response(html, {headers: {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-cache",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"
 }});
}
