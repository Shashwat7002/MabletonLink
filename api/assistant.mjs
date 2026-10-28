import {createGateway} from '../server/vercel-gateway.mjs';
export default {fetch: createGateway()};
