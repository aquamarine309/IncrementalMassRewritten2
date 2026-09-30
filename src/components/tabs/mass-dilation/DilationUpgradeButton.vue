<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "DilationUpgradeButton",
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
      isUnlocked: false,
      time: 0
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "o-dilation-upgrade-btn": true,
        "o-dilation-upgrade-btn--rebuyable": !this.isSingle,
        "o-dilation-upgrade-btn--available": this.canBeBought,
        "o-dilation-upgrade-btn--capped": this.isCapped
      };
    },
    max() {
      return this.upgrade.max;
    },
    isSingle() {
      return this.max.eq(1);
    },
    isCapped() {
      return this.level.gte(this.max);
    },
    levelText() {
      const level = format(this.level, 0);
      if (this.max.isFinite()) return `${level} / ${format(this.max, 0)}`;
      return level;
    },
    estimateTime() {
      if (Number.isFinite(this.time)) return i18n.t("in_X", { value: TimeSpan.fromSeconds(this.time).toStringShort() });
      return i18n.t("never_affordable");
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isUnlocked = upgrade.isUnlocked;
      if (!this.isUnlocked) return;
      this.level.copyFrom(upgrade.boughtAmount);
      this.canBeBought = upgrade.canBeBought;
      if (!this.canBeBought) {
        this.time = this.upgrade.cost.minus(Currency.dilatedMass.value)
          .div(Currency.dilatedMass.gainedAmount).toNumber();
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
    v-if="isUnlocked"
    :class="classObject"
    @click="purchase"
  >
    <span v-if="!isSingle">{{ $t("level_X", { level: levelText }) }}</span>
    <DescriptionDisplay :config="config" />
    <EffectDisplay :config="config" />
    <template v-if="!isCapped">
      <br>
      <CostDisplay
        :config="config"
        name-key="X_dilated_mass"
      />
      <span v-if="!canBeBought">({{ estimateTime }})</span>
    </template>
  </button>
</template>

<style scoped>
.o-dilation-upgrade-btn {
  border: 1px solid white;
  height: 100px;
  background-color: #171717;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: var(--color-accent);
  margin: 2px;
  font-family: BlobFont, "Xia Lu Wen Kai";
  font-size: 10px;
  padding: 4px;
}

.ad-ui .o-dilation-upgrade-btn {
  font-weight: bold;
  background-color: rgba(86, 92, 93, 0.8);
  border-color: var(--color-dilation);
  border-radius: 8px;
  color: black;
}

.ad-ui .o-dilation-upgrade-btn.o-dilation-upgrade-btn--rebuyable {
  border-color: rgba(68, 189, 173, 0.8);
}

.ad-ui.light-theme .o-dilation-upgrade-btn.o-dilation-upgrade-btn--rebuyable {
  border-color: rgba(100, 221, 205, 0.87);
}

.ad-ui.light-theme .o-dilation-upgrade-btn {
  background-color: rgba(153, 153, 153, 0.87);
}

.o-dilation-upgrade-btn--available {
  border-color: var(--color-dilation);
  background-color: black;
  box-shadow: 0 0 5px var(--color-dilation) inset;
}

.ad-ui .o-dilation-upgrade-btn--available {
  color: var(--color-dilation);
  box-shadow: none;
  background-color: black;
}

.ad-ui .o-dilation-upgrade-btn--available.o-dilation-upgrade-btn--rebuyable {
  color: rgba(68, 189, 173);
  border-color: rgba(68, 189, 173);
}

.ad-ui.light-theme .o-dilation-upgrade-btn--available.o-dilation-upgrade-btn--rebuyable {
  color: rgba(100, 221, 205, 0.87);
  border-color: rgba(100, 221, 205, 0.87);
}

.ad-ui.light-theme .o-dilation-upgrade-btn--available {
  background-color: #333333;
}

.ad-ui .o-dilation-upgrade-btn--capped {
  background-color: rgba(142, 189, 16, 0.8);
}

.ad-ui.light-theme .o-dilation-upgrade-btn--capped {
  background-color: rgba(164, 221, 23, 0.87);
  border-color: black !important;
  color: black;
}
</style>