<template>
  <transition name="fade">
    <router-view/>
  </transition>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('fetchData');
  },
};
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
