<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import Decimal from "break_eternity.js";

export default {
  name: "SimpleRankRow",
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
      isDisabled: false,
      amount: new Decimal(),
      canReset: false,
      requirement: new Decimal(),
      autoUnlocked: false,
      auto: false,
      name: ""
    };
  },
  computed: {
    requirementText() {
      if (this.isDisabled) return i18n.t("disabled");
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
      this.canReset = rank.canReset;
      this.requirement = rank.requirement;
      this.autoUnlocked = rank.autoUnlocked;
      this.auto = rank.auto.isActive;
      this.isDisabled = rank.isDisabled;
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
    class="l-simple-rank-row"
  >
    <div class="c-simple-rank-name">
      <span>{{ name }}</span>
      [<span class="c-rank-amount">{{ format(amount, 0) }}</span>]
    </div>
    <PrimaryButton
      :enabled="canReset"
      class="o-buy-mass-upgrade-btn o-buy-mass-upgrade-btn--main"
      @click="reset"
    >
      {{ requirementText }}
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="autoUnlocked"
      v-model="auto"
      class="o-buy-mass-upgrade-btn o-buy-mass-upgrade-btn--auto"
    />
  </div>
</template>

<style scoped>
.l-simple-rank-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  margin: 6px 0;
}

.c-simple-rank-name {
  display: flex;
  flex-direction: row;
  width: 150px;
  align-items: center;
  margin-right: 5px;
}
</style>