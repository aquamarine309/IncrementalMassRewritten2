<script>
import C16Particle from "./C16Particle";

export default {
  name: "C16Background",
  components: { C16Particle },
  data() {
    return {
      isActive: false,
      endTick: Infinity,
      currentTime: 0,
      width: window.innerWidth,
      resizeTimeout: null,
      PARTICLE_COUNT: 50,
      END_TICK_THRESHOLD: 100
    };
  },
  computed: {
    shouldRender() {
      return this.isActive || this.endTick < this.END_TICK_THRESHOLD;
    }
  },
  created() {
    this.handleResize = this.throttle(() => {
      this.width = window.innerWidth;
    }, 250);

    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  },
  methods: {
    throttle(func, limit) {
      return (...args) => {
        if (!this.resizeTimeout) {
          func.apply(this, args);
          this.resizeTimeout = setTimeout(() => {
            this.resizeTimeout = null;
          }, limit);
        }
      };
    },

    update() {
      this.isActive = C16.isActive;

      if (this.isActive || this.endTick < this.END_TICK_THRESHOLD) {
        this.currentTime = Date.now();
      }

      this.endTick = this.isActive ? 0 : this.endTick + 1;
    }
  }
};
</script>

<template>
  <svg
    v-if="shouldRender"
    :width="width"
    height="100%"
    class="c16-particle-bg"
    aria-hidden="true"
  >
    <C16Particle
      v-for="index in PARTICLE_COUNT"
      :key="index"
      :width="width"
      :now="currentTime"
      :is-end="!isActive"
    />
  </svg>
</template>

<style scoped>
.c16-particle-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}
</style>