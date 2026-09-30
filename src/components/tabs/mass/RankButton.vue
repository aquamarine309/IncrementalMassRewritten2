<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import Decimal from "break_eternity.js";

export default {
  name: "RankButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    rank: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: true,
      amount: new Decimal(),
      description: "",
      canReset: false,
      requirement: new Decimal(),
      reward: "",
      autoUnlocked: false,
      auto: false,
      name: ""
    };
  },
  computed: {
    requirementText() {
      const isRank = this.rank.isRank;
      if (isRank) {
        return formatMass(this.requirement);
      }
      return `${this.rank.previous.name} ${format(this.requirement, 0)}`;
    }
  },
  watch: {
    auto(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.rank.auto.isActive = value;
    }
  },
  methods: {
    update() {
      const rank = this.rank;
      this.isUnlocked = rank.isUnlocked;
      if (!this.isUnlocked) return;
      this.name = rank.fullName;
      this.amount.copyFrom(rank.amount);
      this.description = rank.description;
      this.reward = rank.reward;
      this.canReset = rank.canReset;
      this.requirement = rank.requirement;
      this.autoUnlocked = rank.autoUnlocked;
      this.auto = rank.auto.isActive;
    },
    reset() {
      this.rank.reset();
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="l-rank-container"
  >
    <div class="c-rank-title">
      <PrimaryToggleButton
        v-if="autoUnlocked"
        v-model="auto"
      />
      <span>{{ name }}</span>
      <span class="c-rank-amount">{{ format(amount, 0) }}</span>
    </div>
    <PrimaryButton
      :enabled="canReset"
      class="o-rank-btn"
      @click="reset"
    >
      <span>{{ description }}</span>
      <br>
      <span>{{ $t("requires_X", { requirement: requirementText }) }}</span>
      <template v-if="reward !== null">
        <span class="o-split-line" />
        <span>{{ $t("next_reward") }}</span>
        <br>
        <span>{{ reward }}</span>
      </template>
    </PrimaryButton>
  </div>
</template>