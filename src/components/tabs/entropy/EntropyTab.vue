<script>
import Decimal from "break_eternity.js";
import EvaporationButton from "./EvaporationButton";
import EntropyRewardButton from "./EntropyRewardButton";

export default {
  name: "EntropyTab",
  components: {
    EvaporationButton,
    EntropyRewardButton
  },
  data() {
    return {
      entropy: new Decimal(),
      entropyGain: new Decimal(),
      entropyCap: new Decimal(),
      frequency: new Decimal(),
      blackHole: new Decimal(),
      enthalpy: new Decimal(),
      hawkingRadiation: new Decimal()
    };
  },
  computed: {
    enthalpyConfig: () => Entropy.enthalpy,
    hawkingRadiationConfig: () => Entropy.hawkingRadiation,
    rewards: () => Entropy.rewards
  },
  methods: {
    update() {
      this.entropy.copyFrom(Currency.entropy);
      this.entropyGain.copyFrom(Entropy.gain);
      this.entropyCap.copyFrom(Entropy.cap);
      this.frequency.copyFrom(Currency.frequency);
      this.blackHole.copyFrom(Currency.blackHole);
      this.enthalpy.copyFrom(this.enthalpyConfig.data.amount);
      this.hawkingRadiation.copyFrom(this.hawkingRadiationConfig.data.amount);
    }
  }
};
</script>

<template>
  <div>
    <div>You have {{ format(entropy) }} / {{ format(entropyCap) }} Entropy {{ formatGain(entropy, entropyGain) }}.</div>
    <div class="l-evaporation-row">
      <div class="c-evaporation-panel">
        <div class="c-top-evaporation-row">
          {{ $t("your_frequency_simple", { value:
            $t("X_hz", { value: format(frequency) }) }) }}
        </div>
        <EvaporationButton
          :evaporation="enthalpyConfig"
          :res-name="$t('frequency')"
          :gain-name="$t('enthalpy')"
        />
        <div>You have {{ format(enthalpy) }} Enthalpy.</div>
      </div>
      <div class="c-evaporation-panel">
        <div class="c-top-evaporation-row">
          {{ $t("you_have_X_black_hole", { value:
            formatMass(blackHole) }) }}
        </div>
        <EvaporationButton
          :evaporation="hawkingRadiationConfig"
          :res-name="$t('black_hole')"
          :gain-name="$t('hawking_radiation')"
        />
        <div>You have {{ format(hawkingRadiation) }} Hawking Radiation.</div>
      </div>
    </div>
    <div class="l-rewards-container">
      <EntropyRewardButton
        v-for="reward in rewards"
        :key="reward.id"
        :reward="reward"
      />
    </div>
  </div>
</template>

<style scoped>
.l-evaporation-row {
  display: flex;
  flex-direction: row;
  margin: 8px;
}

.c-evaporation-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;
}

.c-top-evaporation-row {
  min-height: 30px;
  justify-content: flex-end;
  font-size: 11px;
}


.l-rewards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
}
</style>