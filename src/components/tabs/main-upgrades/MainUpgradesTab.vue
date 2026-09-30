<script>
import Decimal from "break_eternity.js";
import MainUpgradeButton from "./MainUpgradeButton";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "MainUpgradesTab",
  components: {
    MainUpgradeButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    PrimaryToggleButton
  },
  props: {
    upgrades: {
      type: Array,
      required: true
    },
    currencyAmount: {
      type: Decimal,
      required: true
    },
    currencyKey: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    autobuyer: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      selectedID: -1,
      autoUnlocked: false,
      auto: false
    };
  },
  computed: {
    config() {
      return this.upgrades[this.selectedID].config;
    }
  },
  watch: {
    auto(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.autobuyer.isActive = value;
    }
  },
  methods: {
    update() {
      if (!this.autobuyer) return;
      this.autoUnlocked = this.autobuyer.isUnlocked;
      this.auto = this.autobuyer.isActive;
    },
    select(id) {
      this.selectedID = id;
      GameUI.update();
    }
  }
};
</script>

<template>
  <div @click="selectedID = -1">
    <div
      v-if="selectedID !== -1"
      class="l-main-upgrade-header"
    >
      <DescriptionDisplay
        class="c-sky"
        :config="config"
      />
      <CostDisplay
        :config="config"
        :name-key="currencyKey"
      />
      <EffectDisplay
        :config="config"
        class="c-green"
      />
    </div>
    <div class="c-main-upgrade-name">
      {{ name }}
    </div>
    <div class="c-main-upgrade-currency">
      {{ $t("you_have_X", {
        value: $tc(currencyKey, checkSingle(currencyAmount),
                   { value: format(currencyAmount, 0) })
      }) }}
    </div>
    <PrimaryToggleButton
      v-if="autoUnlocked"
      v-model="auto"
      i18n-key="auto_X"
    />
    <div class="l-main-upgrade-container">
      <MainUpgradeButton
        v-for="upgrade in upgrades"
        :key="upgrade.id"
        :upgrade="upgrade"
        @click.stop="select(upgrade.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.c-main-upgrade-name {
  font-weight: bold;
  margin-top: 20px;
}

.c-main-upgrade-currency {
  font-size: 11px;
  margin: 5px 0;
}

.l-main-upgrade-container {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-template-rows: repeat(5, 40px);
  grid-gap: 5px;
  justify-content: center;
}

.l-main-upgrade-header {
  font-size: 12px;
  line-height: 15px;
  margin: 15px 0;
  border-top: 1px solid #bbbbbb;
  border-bottom: 1px solid #bbbbbb;
  padding: 5px;
  min-height: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>