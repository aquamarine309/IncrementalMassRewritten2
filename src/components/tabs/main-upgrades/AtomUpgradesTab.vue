<script>
import MainUpgradesTab from "./MainUpgradesTab";
import Decimal from "break_eternity.js";

export default {
  name: "AtomUpgradesTab",
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
      return AtomUpgrade.index;
    },
    autobuyer() {
      return Autobuyer.atomUpgrade;
    }
  },
  methods: {
    update() {
      this.currencyAmount.copyFrom(Currency.atoms.value);
    }
  }
};
</script>

<template>
  <MainUpgradesTab
    :upgrades="upgrades"
    :name="$t('tab_upgrades_atom')"
    :currency-amount="currencyAmount"
    currency-key="X_atom"
    :autobuyer="autobuyer"
  />
</template>