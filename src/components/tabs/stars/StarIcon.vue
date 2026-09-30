<script>
import Decimal from "break_eternity.js";

export default {
  name: "StarIcon",
  props: {
    generator: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: new Decimal(),
      gain: new Decimal(),
      isUnlocked: false
    };
  },
  computed: {
    tier() {
      return this.generator.tier;
    },
    styleObject() {
      return {
        "background-image": `url("./images/star_${5 -
        this.tier}.png")`
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.generator.isUnlocked;
      if (!this.isUnlocked) return;
      this.amount.copyFrom(this.generator.amount);
      this.gain = this.generator.gainPerSecond;
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="o-generator-row"
  >
    <div
      class="o-generator-image"
      :style="styleObject"
    />
    <div class="o-generator-text">
      <span>{{ format(amount, 0) }}</span>
      <span>{{ formatGain(amount, gain) }}</span>
    </div>
  </div>
</template>

<style scoped>
.o-generator-row {
  display: flex;
  flex-direction: row;
  margin: 6px 0;
}

.o-generator-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.o-generator-image {
  width: 30px;
  height: 30px;
  background-size: cover;
  margin: 0 6px;
}

.light-theme .o-generator-image {
  filter: invert(1) hue-rotate(180deg);
}
</style>