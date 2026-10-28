import {env} from "cloudflare:workers";
import directory from "../../../public/services.json";
import {createAssistant} from "../../../server/assistant.mjs";
export const dynamic = "force-dynamic";
const handle = createAssistant({directory, getEnv: () => env});
export const POST = handle;
export const GET = handle;
