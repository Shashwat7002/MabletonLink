import {env} from "cloudflare:workers";
import directory from "../../../public/services.json";
import {createAssistant} from "../../../server/assistant.mjs";
import {providerFetch} from "../../../server/provider-fetch.mjs";
export const dynamic = "force-dynamic";
const handle = createAssistant({directory, getEnv: () => env, fetchImpl: providerFetch()});
export const POST = handle;
export const GET = handle;
