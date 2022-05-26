import ImageViewer from "@/components/ImageViewer/main";

import { ImageViewerInstance } from "@/components/ImageViewer";

import '@/assets/style/icon.scss'

const components = [ImageViewer];

const install = function (Vue) {
  Vue.prototype.$preview = ImageViewerInstance;

  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ImageViewer,
};
