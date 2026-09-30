<script>
import Decimal from "break_eternity.js";
import QuantumChallengeBox from "./QuantumChallengeBox";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "QuantumChallengesTab",
  components: {
    QuantumChallengeBox,
    PrimaryButton
  },
  data() {
    return {
      shards: 0,
      isActive: false,
      pendingShards: 0,
      base: new Decimal(),
      effect: new Decimal()
    };
  },
  computed: {
    challenges() {
      return QuantumChallenges.all;
    },
    shardsAmount() {
      const current = formatInt(this.shards);
      const diff = this.pendingShards - this.shards;
      if (diff > 0) {
        return `${current} (+${formatInt(diff)})`;
      }
      if (diff < 0) {
        return `${current} (-${formatInt(-diff)})`;
      }
      return current;
    }
  },
  methods: {
    update() {
      this.shards = QuantumChallenges.shards;
      this.isActive = QuantumChallenges.isActive;
      this.pendingShards = QuantumChallenges.pendingShards.value;
      this.base = QuantumChallenges.base;
      this.effect = QuantumChallenges.effect;
    },
    handleClick() {
      QuantumChallenges.toggle();
    }
  }
};
</script>

<template>
  <div>
    <div>
      {{ $tc("you_have_X_quantum_shard", shards, { value: shardsAmount }) }}
    </div>
    <div>
      {{ $t("quantum_shard_effect_1", { value: format(base, 1) }) }}
    </div>
    <div class="c-green">
      {{ $t("quantum_shard_effect_2", { value: formatX(effect, 1) }) }}
    </div>
    <br>
    <PrimaryButton
      :enabled="pendingShards > 0"
      @click="handleClick"
    >
      {{ isActive ? "Exit" : "Enter" }} the Quantum Challenge
    </PrimaryButton>
    <div class="l-challenges-layout">
      <QuantumChallengeBox
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>
  </div>
</template>

<style scoped>
</style>