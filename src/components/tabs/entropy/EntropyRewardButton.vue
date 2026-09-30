<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "EntropyRewardButton",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    reward: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: new Decimal(),
      nextReq: new Decimal()
    };
  },
  computed: {
    config() {
      return this.reward.config;
    },
    name() {
      return this.config.name();
    }
  },
  methods: {
    update() {
      this.amount.copyFrom(this.reward.amount);
      this.nextReq = this.reward.nextReq;
    }
  }
};
</script>

<template>
  <div class="l-entropy-reward-button-container">
    <div>{{ name }}: {{ format(amount, 0) }}</div>
    <div>Next At: {{ format(nextReq) }}</div>
    <div class="c-entropy-reward-button">
      <DescriptionDisplay :config="config" />
      <EffectDisplay :config="config" />
    </div>
  </div>
</template>

<style scoped>
.l-entropy-reward-button-container {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4px;
  color: var(--color-accent);
  margin: 0 2px;
  flex-direction: column;
  font-size: 10px;
  width: 100%;
}

.c-entropy-reward-button {
  border: 1px solid #666666;
  height: 60px;
  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: BlobFont, "Xia Lu Wen Kai";
  width: 100%;
  padding: 4px;
}

.light-theme .c-entropy-reward-button {
  border-color: #999999;
  background: #dddddd;
}

.ad-ui .c-entropy-reward-button {
  border-radius: 3px;
}
</style>