<script>
import Decimal from "break_eternity.js";

export default {
  name: "FermionBox",
  props: {
    fermion: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      isUnlocked: false,
      tier: new Decimal(),
      cap: new Decimal()
    };
  },
  computed: {
    name() {
      return this.isUnlocked ? i18n.t(this.fermion.config.key) : "???";
    },
    symbol() {
      return this.isUnlocked ? this.fermion.config.symbol : "?";
    },
    tierText() {
      const current = format(this.tier, 0);
      if (this.cap.isFinite()) {
        return `${current} / ${format(this.cap, 0)}`;
      }
      return current;
    },
    isSelected() {
      return this.$viewModel.selectedFermionId === this.fermion.id;
    }
  },
  methods: {
    update() {
      this.isActive = this.fermion.isActive;
      this.isUnlocked = this.fermion.isUnlocked;
      this.tier.copyFrom(this.fermion.tier);
      this.cap = this.fermion.maxTier;
    },
    select() {
      if (this.fermion.isUnlocked) {
        if (this.isSelected) {
          this.fermion.start();
          return;
        }
        this.$viewModel.selectedFermionId = this.fermion.id;
        GameUI.update();
      }
    }
  }
};
</script>

<template>
  <div
    class="c-fermion-box"
    :class="{
      'c-fermion-box--active': isActive,
      'c-fermion-box--locked': !isUnlocked,
      'c-fermion-box--selected': isSelected }"
    @click="select"
  >
    <div
      class="o-fermion-symbol"
      v-html="symbol"
    />
    <div class="o-fermion-name">
      {{ name }}
    </div>
    <div class="o-fermion-tier">
      [{{ tierText }}]
    </div>
  </div>
</template>

<style scoped>

</style>