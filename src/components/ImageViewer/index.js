import Vue from "vue";
import Main from "./main.vue";

const ImageViewerConstructor = Vue.extend(Main);

let instance;

export const ImageViewerInstance = (options) => {
  if (Vue.prototype.$isServer) return;

  if (typeof options.onClose === "function") {
    const preClose = options.onClose;
    options.onClose = () => {
      preClose();
      instance.$destroy();
    };
  } else {
    options.onClose = () => {
      instance.$destroy();
    };
  }

  instance = new ImageViewerConstructor({
    propsData: options,
  });

  instance.$mount();

  return instance;
};
