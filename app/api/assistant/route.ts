import {env} from "cloudflare:workers";
import directory from "../../../public/services.json";
import {createAssistant} from "../../../server/assistant.mjs";
export const dynamic = "force-dynamic";
const handle = createAssistant({directory, getEnv: () => env, fetchImpl: async (...args: Parameters<typeof fetch>) => {
  try {
    const response = await fetch(...args);
    // Status-only operational diagnostics: never log keys, prompts, bodies or URLs.
    if (!response.ok) console.warn(JSON.stringify({event: "gemini_upstream_failure", status: response.status}));
    return response;
  } catch (error) {
    console.warn(JSON.stringify({event: "gemini_transport_failure", timeout: error instanceof Error && error.name === "AbortError"}));
    throw error;
  }
}});
export const POST = handle;
export const GET = handle;
