<script>
import Decimal from "break_eternity.js";
import MassUpgradeRow from "@/components/MassUpgradeRow";

export default {
  name: "IndescribableMatterTab",
  components: {
    MassUpgradeRow
  },
  data() {
    return {
      blueprint: new Decimal(),
      gain: new Decimal(),
      speed: new Decimal()
    };
  },
  computed: {
    cosmicString() {
      return MassUpgrade.cosmicString;
    }
  },
  methods: {
    update() {
      this.blueprint.copyFrom(Currency.blueprint.value);
      this.gain = Currency.blueprint.gainedAmount;
      this.speed = Quantum.speed;
    }
  }
};
</script>

<template>
  <div>
    <div class="c-bh-info">
      <span>
        <i18n-t
          keypath="you_have_X_blueprint_particle"
          tag="span"
        >
          <template #value>
            <span class="o-highlight">
              {{ format(blueprint) }}
            </span>
            <span>{{ formatGain(blueprint, gain) }}</span>
          </template>
        </i18n-t>
      </span>
      <span class="c-green">Which increases pre-Quantum global speed by {{ formatX(speed) }}</span>
    </div>
    <MassUpgradeRow :upgrade="cosmicString" />
  </div>
</template>