import * as server from '../entries/pages/(app)/analytics/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/analytics/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/analytics/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DicjtM4C.js","_app/immutable/chunks/C7X_R0oq.js","_app/immutable/chunks/DpWMplyU.js","_app/immutable/chunks/CSkdr2zs.js","_app/immutable/chunks/DZRnL1fH.js","_app/immutable/chunks/BXvkUfRx.js","_app/immutable/chunks/Bowx3sTY.js","_app/immutable/chunks/BqiXTvVZ.js","_app/immutable/chunks/BIcj0QJM.js","_app/immutable/chunks/DW-iQbGu.js"];
export const stylesheets = [];
export const fonts = [];
