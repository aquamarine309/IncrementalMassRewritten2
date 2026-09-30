<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";

export default {
  name: "PrimordiumRow",
  components: {
    DescriptionDisplay
  },
  props: {
    particle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: new Decimal()
    };
  },
  computed: {
    effectList() {
      return this.particle.effects;
    },
    name() {
      return this.particle.name;
    },
    symbol() {
      return this.particle.symbol;
    }
  },
  methods: {
    update() {
      this.amount.copyFrom(this.particle.amount);
    }
  }
};
</script>

<template>
  <div class="l-primordium-row">
    <div class="c-primordium-info">
      <div class="o-primordium-symbol">
        {{ symbol }}
      </div>
      <div class="o-primordium-name">
        <div>{{ name }}</div>
        <div>- [{{ format(amount, 0) }}]</div>
      </div>
    </div>
    <div class="c-primordium-effects">
      <DescriptionDisplay
        v-for="(effect, idx) of effectList"
        :key="idx"
        :config="effect.config"
      />
    </div>
  </div>
</template>

<style scoped>
.l-primordium-row {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 0 6px;
}

.c-primordium-info {
  display: flex;
  flex-direction: row;
}

.o-primordium-symbol {
  font-size: 40px;
  font-weight: bold;
  margin-right: 10px;
  width: 50px;
  height: 50px;
}

.o-primordium-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3px 0;
  font-size: 12px;
}

.o-primordium-name div:first-child {
  font-size: 16px;
}

.c-primordium-effects {
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  justify-content: flex-start;
}
</style>