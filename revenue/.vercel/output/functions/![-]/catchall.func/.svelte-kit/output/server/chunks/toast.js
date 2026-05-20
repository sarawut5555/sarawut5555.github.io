import { w as writable } from "./index.js";
function createToastStore() {
  const { subscribe, update } = writable([]);
  return {
    subscribe,
    show(message, type = "info") {
      const id = crypto.randomUUID();
      update((t) => [...t, { id, message, type }]);
      setTimeout(() => {
        update((t) => t.filter((x) => x.id !== id));
      }, 3500);
    },
    dismiss(id) {
      update((t) => t.filter((x) => x.id !== id));
    }
  };
}
const toasts = createToastStore();
export {
  toasts as t
};
