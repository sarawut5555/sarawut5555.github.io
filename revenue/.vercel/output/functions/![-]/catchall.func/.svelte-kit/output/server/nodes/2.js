import * as server from '../entries/pages/(app)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Tmw1sJjY.js","_app/immutable/chunks/C7X_R0oq.js","_app/immutable/chunks/DpWMplyU.js","_app/immutable/chunks/BXANP_Se.js","_app/immutable/chunks/DZRnL1fH.js","_app/immutable/chunks/Cx5z9B_b.js","_app/immutable/chunks/CSkdr2zs.js","_app/immutable/chunks/BKZhhuCt.js","_app/immutable/chunks/Bflg0XU5.js","_app/immutable/chunks/Da6wR441.js","_app/immutable/chunks/DW-iQbGu.js","_app/immutable/chunks/B_pPChyW.js","_app/immutable/chunks/2yy3S3SZ.js","_app/immutable/chunks/C3wNaGs4.js"];
export const stylesheets = [];
export const fonts = [];
