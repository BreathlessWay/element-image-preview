import Vue from "vue";

import App from "./App";

import ImageViewer from "./index.js";

Vue.use(ImageViewer);

new Vue({
  // eslint-disable-line
  render: (h) => h(App),
}).$mount("#app");
