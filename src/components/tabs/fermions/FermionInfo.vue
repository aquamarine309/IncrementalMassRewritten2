<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "FermionInfo",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    PrimaryButton
  },
  props: {
    selected: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      tier: new Decimal(),
      nextTierAt: new Decimal(),
      cap: new Decimal(),
      isActive: false,
      currentValue: new Decimal()
    };
  },
  computed: {
    fermion() {
      return Fermions.all[this.selected];
    },
    config() {
      return this.fermion.config;
    },
    name() {
      return i18n.t(this.config.key);
    },
    scalingName() {
      return Scaling.fermion.getName(this.tier);
    },
    notSelected() {
      return this.selected === -1;
    },
    reward() {
      return this.fermion.reward;
    },
    rewardConfig() {
      return this.reward.config;
    },
    tierText() {
      const current = format(this.tier, 0);
      if (this.cap.isFinite()) {
        return `${current} / ${format(this.cap, 0)}`;
      }
      return current;
    }
  },
  methods: {
    update() {
      if (this.notSelected) return;
      const fermion = this.fermion;
      this.tier.copyFrom(fermion.tier);
      this.cap = fermion.maxTier;
      this.nextTierAt = fermion.requirement;
      this.isActive = fermion.isActive;
      if (this.isActive) {
        this.currentValue.copyFrom(fermion.currency);
      }
    },
    formatValue(value) {
      const formattedValue = this.config.formatAsMass ? formatMass(value) : format(value);
      if (!this.config.currencyKey) return formattedValue;
      return i18n.tc(this.config.currencyKey, checkSingle(value), { value: formattedValue });
    },
    handleClick() {
      if (this.isActive) {
        Resets.supernova.resetLayer(true, true);
      } else {
        this.fermion.start();
      }
    }
  }
};
</script>

<template>
  <div class="l-fermion-info">
    <template v-if="notSelected">
      <div>Click the Fermion to show infomation</div>
    </template>
    <template v-else>
      <span class="c-fermion-name">{{ name }} [{{ scalingName }}{{ $t("tier_X", { value: tierText }) }}]</span>
      <br>
      <DescriptionDisplay
        :config="config"
        title-key="on_active_X"
        class="c-red"
      />
      <EffectDisplay
        :config="config"
        class="c-red"
      />
      <span v-if="isActive">{{ $t("currently_X", { effect: formatValue(currentValue) }) }}</span>
      <span>Next Tier At: {{ formatValue(nextTierAt) }} </span>
      <DescriptionDisplay
        :config="rewardConfig"
        title-key="reward_X"
        class="c-green"
      />
      <EffectDisplay
        :config="rewardConfig"
        class="c-green"
      />
      <PrimaryButton @click="handleClick">
        {{ isActive ? $t("exit") : $t("start") }}
      </PrimaryButton>
    </template>
  </div>
</template>

<style scoped>
.c-fermion-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px black;
}

.light-theme .c-fermion-name {
  text-shadow: 1px 1px 3px white;
  color: black;
}
</style>