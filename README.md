# element-image-preview

## ImageViewer 图片预览

图片预览组件，从 [element-ui](https://element.eleme.cn/#/zh-CN/component/image) 的图片组件中剥离出来的单独的图片预览功能，参数和 element-ui 一致，主要为解决当预览图片需要通过接口获取高清图片地址时，添加了 `onFetchImage` 参数，当没有次参数时，默认使用 `urlList` 展示，若有，当切换图片会先调用 `onFetchImage` 获取真实要预览的图片地址

### 基础用法

:::demo 可通过组件形式调用

```html
<div class="demo-image">
  <image-preview :urlList="url"></image-preview>
</div>

<script>
  export default {
    data() {
      return {
        url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      };
    },
  };
</script>
```

:::demo 也可通过 `this.$preview` 调用

```html
<div class="demo-image__preview">
  <article @click="preview">Image Viewer</article>
</div>

<script>
  export default {
    methods: {
      preview() {
        this.$preview({
          urlList: [
            "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
            "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
          ],
        });
      },
    },
  };
</script>
```
### 异步获取展示图片地址

:::demo 也可通过 `this.$preview` 调用

```html
<div class="demo-image__preview">
  <article @click="preview">Image Viewer</article>
</div>

<script>
  export default {
      methods: {
          preview() {
              this.$preview({
                  urlList: [
                      "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
                      "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
                  ],
                  onFetchImage: this.onFetchImage,
              });
          },
          onFetchImage(v) {
              console.log(v);
              return new Promise((resolve) => {
                  setTimeout(() => {
                      resolve(
                              "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                      );
                  });
              });
          },
      },
  };
</script>
```

:::

### Attributes

| 参数         | 说明                                           | 类型            | 可选值 | 默认值  |
| ------------ | ---------------------------------------------- | --------------- | ------ |------|
| urlList      | 预览图片预览地址                               | Array           | —      | []   |
| initialIndex | 默认激活的图片索引                             | Number          | —      | 0    |
| z-index      | 设置图片预览的 z-index                         | Number          | —      | 2000 |
| initialIndex | 默认激活的图片索引                             | Number          | —      | 0    |
| maskClosable | 点击蒙层关闭预览                               | Boolean         | —      | true |
| onSwitch     | 切换图片时的回调，接受当前激活的图片索引参数   | Function(index) | —      | -    |
| onClose      | 关闭预览时的回调                               | Function()      | —      | -    |
| onFetchImage | 异步获取图片的回调，接受当前激活的图片地址参数 | Function(url)   | —      | -    |
