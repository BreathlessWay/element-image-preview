<template>
  <transition name="viewer-fade" appear>
    <div
      ref="el-image-viewer__wrapper"
      tabindex="-1"
      class="el-image-viewer__wrapper"
      :style="{ 'z-index': zIndex }"
    >
      <div class="el-image-viewer__mask" @click.self="handleMaskClick"></div>
      <!-- CLOSE -->
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide">
        <i class="iv-icon-close"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev"
        >
          <i class="iv-icon-arrow-left" />
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next"
        >
          <i class="iv-icon-arrow-right" />
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <i class="iv-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="iv-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i
            class="iv-icon-refresh-left"
            @click="handleActions('anticlocelise')"
          ></i>
          <i
            class="iv-icon-refresh-right"
            @click="handleActions('clocelise')"
          ></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas">
        <img
          v-if="showImageUrl"
          ref="img"
          class="el-image-viewer__img"
          :src="showImageUrl"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
        />
        <div class="el-loading-spinner" v-show="loading">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from "@/utils";
import { rafThrottle, isFirefox } from "@/utils";

const Mode = {
  CONTAIN: {
    name: "contain",
    icon: "iv-icon-full-screen",
  },
  ORIGINAL: {
    name: "original",
    icon: "iv-icon-c-scale-to-original",
  },
};

const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";

let cacheFilePath = {};

let prevOverflow = "";

export default {
  name: "ImageViewer",
  props: {
    urlList: {
      type: Array,
      default: () => [],
    },
    zIndex: {
      type: Number,
      default: 2000,
    },
    onSwitch: {
      type: Function,
      default: () => {},
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    onFetchImage: {
      type: Function,
    },
    initialIndex: {
      type: Number,
      default: 0,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      },
      showImageUrl: "",
    };
  },
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    isFirst() {
      return this.index === 0;
    },
    isLast() {
      return this.index === this.urlList.length - 1;
    },
    currentImg() {
      return this.urlList[this.index];
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = "100%";
      }
      return style;
    },
  },
  watch: {
    index: {
      handler: function (val) {
        this.reset();
        this.onSwitch(val);
      },
    },
    currentImg(val) {
      this.getImagePath();
    },
    showImageUrl() {
      this.$nextTick((_) => {
        const $img = this.$refs.img;
        if (!$img.complete) {
          this.loading = true;
        }
      });
    },
  },
  mounted() {
    this.deviceSupportInstall();
    document.body.appendChild(this.$el);
    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs["el-image-viewer__wrapper"].focus();
    this.getImagePath();
  },
  destroyed() {
    document.body.style.overflow = prevOverflow;
    cacheFilePath = {};
    // if appendToBody is true, remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  methods: {
    async getImagePath() {
      if (this.onFetchImage) {
        const cachePath = cacheFilePath[this.currentImg];
        if (cachePath) {
          this.showImageUrl = cachePath;
          return;
        }
        try {
          this.loading = true;
          const imageUrl = await this.onFetchImage(this.currentImg);
          cacheFilePath[this.currentImg] = imageUrl || "";
          this.showImageUrl = imageUrl || "";
        } catch (e) {
          console.log(e);
        } finally {
          this.loading = false;
        }
      } else {
        this.showImageUrl = this.currentImg;
      }
    },
    hide() {
      this.deviceSupportUninstall();
      this.onClose();
    },
    deviceSupportInstall() {
      this._keyDownHandler = (e) => {
        e.stopPropagation();
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions("zoomIn");
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions("zoomOut");
            break;
        }
      };
      this._mouseWheelHandler = rafThrottle((e) => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions("zoomIn", {
            zoomRate: 0.015,
            enableTransition: false,
          });
        } else {
          this.handleActions("zoomOut", {
            zoomRate: 0.015,
            enableTransition: false,
          });
        }
      });
      on(document, "keydown", this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = "加载失败";
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;
      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle((ev) => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, "mousemove", this._dragHandler);
      on(document, "mouseup", (ev) => {
        off(document, "mousemove", this._dragHandler);
      });
      e.preventDefault();
    },
    handleMaskClick() {
      if (this.maskClosable) {
        this.hide();
      }
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false,
      };
    },
    toggleMode() {
      if (this.loading) return;
      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev() {
      if (this.isFirst && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options,
      };
      const { transform } = this;
      switch (action) {
        case "zoomOut":
          if (transform.scale > 0.2) {
            transform.scale = parseFloat(
              (transform.scale - zoomRate).toFixed(3)
            );
          }
          break;
        case "zoomIn":
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case "clocelise":
          transform.deg += rotateDeg;
          break;
        case "anticlocelise":
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    },
  },
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
