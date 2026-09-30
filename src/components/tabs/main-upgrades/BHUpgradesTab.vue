<script>
import Decimal from "break_eternity.js";
import MainUpgradesTab from "./MainUpgradesTab";

export default {
  name: "BHUpgradesTab",
  components: {
    MainUpgradesTab
  },
  data() {
    return {
      currencyAmount: new Decimal()
    };
  },
  computed: {
    upgrades() {
      return BHUpgrade.index;
    },
    autobuyer() {
      return Autobuyer.blackHoleUpgrade;
    }
  },
  methods: {
    update() {
      this.currencyAmount.copyFrom(Currency.darkMatter.value);
    }
  }
};
</script>

<template>
  <MainUpgradesTab
    :upgrades="upgrades"
    :name="$t('tab_upgrades_black_hole')"
    :currency-amount="currencyAmount"
    currency-key="X_dark_matter"
    :autobuyer="autobuyer"
  />
</template>