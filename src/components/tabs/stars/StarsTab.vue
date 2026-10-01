<script>
import Decimal from "break_eternity.js";
import UnlockGeneratorButton from "./UnlockGeneratorButton";
import MassUpgradeRow from "@/components/MassUpgradeRow";
import StarIcon from "./StarIcon";

export default {
  name: "StarsTab",
  components: {
    UnlockGeneratorButton,
    MassUpgradeRow,
    StarIcon
  },
  data() {
    return {
      stars: new Decimal(),
      requirement: new Decimal(),
      gain: new Decimal(),
      boost: new Decimal(),
      softcapped: false,
      softcapStart: new Decimal()
    };
  },
  computed: {
    generators() {
      return StarGenerators.all;
    },
    booster() {
      return MassUpgrade.starBooster;
    }
  },
  methods: {
    update() {
      this.stars.copyFrom(Currency.stars.value);
      this.gain.copyFrom(Currency.stars.gainedAmount);
      this.requirement = Supernova.requirement;
      this.boost = Stars.boost;
      this.softcapStart = Stars.softcapStart;
      this.softcapped = this.stars.gte(this.softcapStart);
    }
  }
};
</script>

<template>
  <div>
    <i18n-t
      keypath="star_collapse_description"
      tag="div"
    >
      <template #starsAndRequirement>
        <span class="o-highlight">
          {{ format(stars, 2) }} / {{ format(requirement, 2) }} {{ formatGain(stars, gain) }}
        </span>
      </template>
    </i18n-t>
    <br>
    <div class="c-green">
      {{ $t("currently_X", { effect: formatX(boost) }) }}
    </div>
    <br>
    <UnlockGeneratorButton />
    <div class="l-stars-container">
      <StarIcon
        v-for="generator in generators"
        :key="generator.tier"
        :generator="generator"
      />
    </div>
    <MassUpgradeRow :upgrade="booster" />
    <div v-if="softcapped">
      <div class="c-mass-softcap-row">
        {{ $t("star_softcap", { value: format(softcapStart) }) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-stars-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  margin-top: 10px;
}
</style>