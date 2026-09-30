<script>
import RelativisticParticle from "./RelativisticParticle";

export default {
  name: "RelativisticParticles",
  components: {
    RelativisticParticle
  },
  data() {
    return {
      count: 0,
      initialized: false,
      bounds: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.$nextTick(this.updateSize);
    window.addEventListener("resize", this.updateSize);
    this.initialized = true;
  },
  unmounted() {
    window.removeEventListener("resize", this.updateSize);
  },
  methods: {
    update() {
      this.count = Currency.relativisticParticles.gte(1)
        ? Math.clamp(Math.floor(20 * Math.log10(Currency.relativisticParticles.value.log10().toNumber())), 1, 20)
        : 0;
    },
    updateSize() {
      this.bounds.x = this.$el.clientWidth;
      this.bounds.y = this.$el.clientHeight;
    }
  }
};
</script>

<template>
  <svg
    v-if="initialized"
    class="c-tachyon-particle-container"
  >
    <RelativisticParticle
      v-for="i in count"
      :key="i"
      :bounds="bounds"
    />
  </svg>
</template>

<style scoped>

</style>
