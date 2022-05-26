<template>
  <article>Image Viewer</article>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$preview({
      urlList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
      ],
    });
  },
};
</script>

<style scoped lang="scss"></style>
