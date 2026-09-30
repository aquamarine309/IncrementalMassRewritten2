<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "BosonUpgradeButton",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      level: new Decimal(),
      canBeBought: false,
      time: 0
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-boson-upgrade-btn": true,
        "o-boson-upgrade-btn--available": this.canBeBought
      };
    },
    estimateTime() {
      if (Number.isFinite(this.time)) return i18n.t("in_X", { value: TimeSpan.fromSeconds(this.time).toStringShort() });
      return i18n.t("never_affordable");
    },
    currencyKey() {
      return `X_${this.upgrade.type}`;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.level.copyFrom(upgrade.boughtAmount);
      this.canBeBought = upgrade.canBeBought;
      if (!this.canBeBought) {
        this.time = this.upgrade.cost.minus(this.upgrade.currency).div(this.upgrade.boson.gain).toNumber();
      }
    },
    purchase() {
      this.upgrade.buyMax();
    }
  }
};
</script>

<template>
  <button
    :class="classObject"
    @click="purchase"
  >
    <span>{{ $t("level_X", { level: format(level, 0) }) }}</span>
    <DescriptionDisplay :config="config" />
    <EffectDisplay :config="config" />
    <br>
    <CostDisplay
      :config="config"
      :name-key="currencyKey"
    />
    <span v-if="!canBeBought">({{ estimateTime }})</span>
  </button>
</template>

<style scoped>
.o-boson-upgrade-btn {
  border: 1px solid white;
  height: 100px;
  background-color: #171717;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  margin: 4px 1px;
  font-family: BlobFont, "Xia Lu Wen Kai";
  font-size: 10px;
  padding: 4px;
  width: 100%;
}

.o-boson-upgrade-btn--available {
  background-color: #444444;
}

.light-theme .o-boson-upgrade-btn {
  color: white;
  font-weight: bold;
  background-color: rgba(80, 80, 80, 0.2);
  border-color: white;
}

.ad-ui .o-boson-upgrade-btn {
  border-radius: 8px;
}

.light-theme .o-boson-upgrade-btn--available {
  background-color: rgba(180, 180, 180, 0.5);
}
</style>