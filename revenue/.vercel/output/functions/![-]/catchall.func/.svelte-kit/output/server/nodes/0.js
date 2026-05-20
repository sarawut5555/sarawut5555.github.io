import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CnUCyBqI.js","_app/immutable/chunks/C7X_R0oq.js","_app/immutable/chunks/DpWMplyU.js","_app/immutable/chunks/BXANP_Se.js","_app/immutable/chunks/DZRnL1fH.js","_app/immutable/chunks/Cx5z9B_b.js","_app/immutable/chunks/Bflg0XU5.js","_app/immutable/chunks/qIjOdu04.js","_app/immutable/chunks/C3wNaGs4.js","_app/immutable/chunks/2yy3S3SZ.js"];
export const stylesheets = ["_app/immutable/assets/0.BEStHjeF.css"];
export const fonts = [];
