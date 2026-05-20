import * as server from '../entries/pages/(app)/dashboard/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.lxOzDhTP.js","_app/immutable/chunks/C7X_R0oq.js","_app/immutable/chunks/DpWMplyU.js","_app/immutable/chunks/Cx5z9B_b.js","_app/immutable/chunks/CSkdr2zs.js","_app/immutable/chunks/DZRnL1fH.js","_app/immutable/chunks/Bflg0XU5.js","_app/immutable/chunks/BqiXTvVZ.js","_app/immutable/chunks/BIcj0QJM.js","_app/immutable/chunks/DW-iQbGu.js","_app/immutable/chunks/BXvkUfRx.js","_app/immutable/chunks/Bowx3sTY.js","_app/immutable/chunks/DiJQf71x.js"];
export const stylesheets = [];
export const fonts = [];
