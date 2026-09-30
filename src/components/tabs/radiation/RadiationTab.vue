<script>
import Decimal from "break_eternity.js";
import RadiationBox from "./RadiationBox";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "RadiationTab",
  components: {
    RadiationBox,
    PrimaryToggleButton
  },
  data() {
    return {
      frequency: new Decimal(),
      frequencyGain: new Decimal(),
      effect: new Decimal(),
      next: null,
      autoUnlocked: false,
      auto: false,
      radiationUnlocked: false,
      evaporating: false
    };
  },
  computed: {
    types: () => RadiationType.all
  },
  watch: {
    auto(value) {
      Autobuyer.radiation.isActive = value;
    }
  },
  methods: {
    update() {
      this.radiationUnlocked = Radiation.isUnlocked;
      this.frequency.copyFrom(Currency.frequency.value);
      this.frequencyGain.copyFrom(Currency.frequency.gainedAmount);
      this.effect = Radiation.frequencyEffect;
      const next = RadiationType.all.find(x => !x.isUnlocked);
      this.next = next;
      this.autoUnlocked = Autobuyer.radiation.isUnlocked;
      this.auto = Autobuyer.radiation.isActive;
      this.evaporating = Entropy.enthalpy.data.isActive;
    }
  }
};
</script>

<template>
  <div>
    <i18n
      path="your_frequency"
      tag="div"
    >
      <template #value>
        <span class="o-highlight">
          {{ format(frequency) }} {{ evaporating ? `(${$t("being_evaporated")})` : formatGain(frequency, frequencyGain) }}
        </span>
      </template>
      <template #mult>
        <span class="o-highlight">
          {{ formatX(effect) }}
        </span>
      </template>
    </i18n>
    <div v-if="radiationUnlocked && next">
      {{ $t("next_radiation", { value: format(next.requirement), object: next.name }) }}
    </div>
    <div v-if="radiationUnlocked && autoUnlocked">
      <PrimaryToggleButton
        v-model="auto"
        i18n-key="auto_X"
      />
    </div>
    <div v-if="radiationUnlocked">
      <RadiationBox
        v-for="type in types"
        :key="type.id"
        :radiation="type"
      />
    </div>
    <div v-else>
      Purchase [unl1] to unlock Radiation.
    </div>
  </div>
</template>

<style scoped>

</style>