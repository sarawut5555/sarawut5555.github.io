import "clsx";
import { a6 as ssr_context } from "./renderer.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function ApexChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { options, height = 280 } = $$props;
    let chart = null;
    onDestroy(() => chart?.destroy());
    $$renderer2.push(`<div class="w-full"></div>`);
  });
}
export {
  ApexChart as A
};
