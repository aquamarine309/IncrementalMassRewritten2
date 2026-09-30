<script>
export default {
  name: "NeutronUpgradeConnection",
  props: {
    connection: {
      type: Array,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isBought: false,
      canBeBought: false
    };
  },
  computed: {
    start() {
      return this.connection[0];
    },
    end() {
      return this.connection[1];
    },
    isQuantum() {
      return this.start.quantum;
    },
    lineColor() {
      if (this.isBought) return this.isQuantum ? "#39ff49" : "var(--color-bought)";
      return this.canBeBought ? "#eeeeee" : "#555555";
    },
    decorationColor() {
      if (this.isBought) return this.isQuantum ? "#009c15" : "#eeeeee";
      return "#888888";
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.end.branchBought;
      if (!this.isUnlocked) return;
      this.isBought = this.end.isBought;
      if (this.isBought) return;
      this.canBeBought = this.end.canBeBought;
    },
    circlePos(index) {
      const p = (this.time / 3000 + index / 3) % 1;
      return {
        cx: to(this.start.pos[0], this.end.pos[0], p),
        cy: to(this.start.pos[1], this.end.pos[1], p)
      };
    }
  }
};

function to(a, b, r) {
  return a * (1 - r) + b * r;
}
</script>

<template>
  <g v-if="isUnlocked">
    <line
      class="o-neutron-upgrade-line"
      :x1="start.pos[0]"
      :y1="start.pos[1]"
      :x2="end.pos[0]"
      :y2="end.pos[1]"
      :style="{ stroke: lineColor }"
    />
    <circle
      v-for="i in 3"
      :key="i"
      v-bind="circlePos(i - 1)"
      r="4"
      :fill="decorationColor"
    />
  </g>
</template>

<style scoped>
.o-neutron-upgrade-line {
  stroke-width: 8px;
}
</style>