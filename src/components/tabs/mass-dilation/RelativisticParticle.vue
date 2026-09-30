<script>
import TWEEN from "tween.js";

export default {
  name: "RelativisticParticle",
  props: {
    bounds: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.fly();
  },
  beforeUnmount() {
    TWEEN.remove(this.tween);
  },
  methods: {
    fly() {
      const bounds = this.bounds;
      const start = {
        x: Math.random() * bounds.x,
        y: Math.random() * bounds.y
      };
      const direction = randomUnitVector();
      const MIN_SPEED = 0.75;
      const MAX_SPEED = 1.25;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      const intersectionLength = intersect(start, direction, { x: 0, y: 0 }, bounds);
      const intersection = {
        x: start.x + direction.x * intersectionLength,
        y: start.y + direction.y * intersectionLength
      };
      const duration = Math.max(intersectionLength / speed, 1);

      const position = start;
      this.tween = new TWEEN.Tween(position)
        .to(intersection, duration)
        .onUpdate(() => {
          this.$el.setAttribute("cx", position.x);
          this.$el.setAttribute("cy", position.y);
        })
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(this.fly.bind(this))
        .start(tweenTime);

      function randomUnitVector() {
        const azimuth = Math.random() * 2 * Math.PI;
        return {
          x: Math.cos(azimuth),
          y: Math.sin(azimuth)
        };
      }
      // eslint-disable-next-line max-params
      function intersect(rayStart, rayUnit, rectAA, rectBB) {
        const dirfrac = {
          x: 1 / rayUnit.x,
          y: 1 / rayUnit.y
        };
        const t1 = (rectAA.x - rayStart.x) * dirfrac.x;
        const t2 = (rectBB.x - rayStart.x) * dirfrac.x;
        const t3 = (rectAA.y - rayStart.y) * dirfrac.y;
        const t4 = (rectBB.y - rayStart.y) * dirfrac.y;
        return Math.min(Math.max(t1, t2), Math.max(t3, t4));
      }
    }
  }
};
</script>

<template>
  <circle
    r="2"
    class="o-tachyon-particle"
  />
</template>

<style scoped>

</style>
