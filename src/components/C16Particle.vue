<script>
export default {
  name: "C16Particle",
  props: {
    now: { type: Number, required: true },
    width: { type: Number, required: true },
    isEnd: { type: Boolean, required: true }
  },
  data() {
    return {
      posX: 0,
      posY: "0%",
      speed: 0,
      size: 0,
      lastUpdateTime: 0,
      color: "",
      COLORS: ["var(--color-accent)", "#dd3333", "#3333dd"]
    };
  },
  created() {
    this.initParticle();
  },
  methods: {
    initParticle() {
      this.posY = `${Math.random() * 100}%`;
      this.speed = (Math.random() * 0.1 + 0.35) * this.width;
      this.posX = -this.width * Math.random() - 10;
      this.size = Math.random() * 5 + 6;
      this.lastUpdateTime = this.now;
      this.color = this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    },

    update() {
      if (!this.lastUpdateTime) {
        this.lastUpdateTime = this.now;
        return;
      }

      const deltaTime = Math.min(this.now - this.lastUpdateTime, 100);

      if (this.isEnd && this.size > 0) {
        this.speed += this.width * deltaTime * 0.001;
        this.size = Math.max(0, this.size - deltaTime * 0.01);
      }

      this.lastUpdateTime = this.now;
      this.posX += this.speed * deltaTime * 0.001;

      if (this.posX > this.width && !this.isEnd) {
        this.initParticle();
      }
    }
  }
};
</script>

<template>
  <rect
    :x="posX"
    :y="posY"
    :width="size"
    :height="size"
    :fill="color"
  />
</template>