<template>
  <article>1</article>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$preview({
      urlList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
    });
  },
};
</script>

<style scoped lang="scss"></style>
