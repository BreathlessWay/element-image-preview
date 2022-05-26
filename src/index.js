import Vue from "vue";
import Main from "./ImageViewer.vue";

const ImageViewerConstructor = Vue.extend(Main);

let instance;

export const ImageViewer = (options) => {
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
		propsData: options
	});
	return instance;
};

const install = function (Vue) {
	Vue.prototype.$preview = ImageViewer;
	Vue.component(Main.name, Main);
};

if (typeof window !== "undefined" && window.Vue) {
	install(window.Vue);
}

export default {
	install,
	Main,
	ImageViewer
};
