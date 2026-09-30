<script>
export default {
  name: "BackgroundStar",
  data() {
    return {
      isVisible: false,
      percent: 0
    };
  },
  computed: {
    styleObject() {
      const p = this.percent;
      const size = Math.min(window.innerWidth, window.innerHeight) * p * 0.9;
      let color;
      if (p > 0.8) {
        color = "rgb(153, 0, 0)";
      } else if (p > 0.7) {
        color = `rgb(${255 - (p - 0.7) / 0.1 * 102}, ${82 - (p - 0.7) / 0.1 * 82}, 0)`;
      } else if (p > 0.6) {
        color = `rgb(255, ${213 - (p - 0.6) / 0.1 * 131}, 0)`;
      } else if (p > 0.4) {
        color = `rgb(${(p - 0.4) / 0.2 * 64 + 191}, ${224 - (p - 0.4) / 0.2 * 11}, ${255 - (p - 0.4) / 0.2 * 255})`;
      } else {
        color = `rgb(${p / 0.4 * 191}, ${p / 0.4 * 91 + 133}, 255)`;
      }
      return {
        "--var-size": `${size}px`,
        "--star-color": color,
      };
    }
  },
  methods: {
    update() {
      this.isVisible = player.options.starBG && Currency.stars.value.gt(1);
      if (!this.isVisible) return;
      this.percent = Currency.stars.value.log10().div(Supernova.requirement.max(1).log10()).clamp(0, 1).toNumber();
    }
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    class="o-background-star"
    :style="styleObject"
  />
</template>

<style scoped>
.o-background-star {
  width: var(--var-size);
  height: var(--var-size);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.25;
  transition-duration: 0.15s;
  background: var(--star-color);

  box-shadow: 0 0 5px 2px rgba(255, 255, 255, 0.1);
}

.ad-ui .o-background-star {
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.5) 0%,
      transparent 40%
    ),
    var(--star-color);
  box-shadow: 0 0 5px 5px rgba(255, 255, 0, 0.2);
}
</style>