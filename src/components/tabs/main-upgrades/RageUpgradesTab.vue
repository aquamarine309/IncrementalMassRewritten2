<script>
import Decimal from "break_eternity.js";
import MainUpgradesTab from "./MainUpgradesTab";

export default {
  name: "RageUpgradesTab",
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
      return RageUpgrade.index;
    },
    autobuyer() {
      return Autobuyer.rageUpgrade;
    }
  },
  methods: {
    update() {
      this.currencyAmount.copyFrom(Currency.ragePowers.value);
    }
  }
};
</script>

<template>
  <MainUpgradesTab
    :upgrades="upgrades"
    :name="$t('tab_upgrades_rage')"
    :currency-amount="currencyAmount"
    currency-key="X_rage_power"
    :autobuyer="autobuyer"
  />
</template>