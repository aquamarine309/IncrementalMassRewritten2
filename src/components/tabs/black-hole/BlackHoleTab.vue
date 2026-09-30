<script>
import Decimal from "break_eternity.js";
import MassUpgradeRow from "@/components/MassUpgradeRow";

export default {
  name: "BlackHoleTab",
  components: {
    MassUpgradeRow
  },
  data() {
    return {
      blackHole: new Decimal(),
      gain: new Decimal(),
      mult: new Decimal(),
      condenserMult: new Decimal(),
      exponent: new Decimal(),
      softcapStart: new Decimal(),
      softcapped: false,
      gainSoftcapStart: new Decimal(),
      gainSoftcapped: false
    };
  },
  computed: {
    condenser() {
      return MassUpgrade.condenser;
    }
  },
  methods: {
    update() {
      this.blackHole.copyFrom(Currency.blackHole.value);
      this.gain = Currency.blackHole.gainedAmount;
      this.mult = BlackHole.mult;
      this.condenserMult = this.condenser.effectValue;
      this.exponent = BlackHole.exponent;
      this.softcapStart = BlackHole.softcapStart;
      this.softcapped = this.blackHole.gte(this.softcapStart);
      this.gainSoftcapStart = BlackHole.gainSoftcapStart;
      this.gainSoftcapped = this.blackHole.add(1).pow(this.exponent).gte(this.gainSoftcapStart);
    }
  }
};
</script>

<template>
  <div>
    <div class="c-bh-info">
      <i18n
        path="you_have_X"
        tag="div"
      >
        <template #value>
          <span class="o-highlight">{{ formatMass(blackHole) }}</span>
          {{ formatGain(blackHole, gain, true) }} {{ $t("of_black_hole") }}
        </template>
      </i18n>
      <span class="c-green">{{ $t("black_hole_effect", { value: formatX(mult) }) }}</span>
      <br>
      <span>{{ $t("black_hole_formula") }}:</span>
      <i>(x + 1)<sup>{{ format(exponent) }}</sup> * {{ format(condenserMult) }}</i>
    </div>
    <MassUpgradeRow :upgrade="condenser" />
    <div v-if="softcapped">
      <div class="c-mass-softcap-row">
        {{ $t("black_hole_softcap", { mass: formatMass(softcapStart) }) }}
      </div>
    </div>
    <div v-if="gainSoftcapped">
      <div class="c-mass-softcap-row">
        The formula (x + 1)<sup>{{ format(exponent) }}</sup> is softcapped at {{ formatMass(gainSoftcapStart) }}
      </div>
    </div>
  </div>
</template>