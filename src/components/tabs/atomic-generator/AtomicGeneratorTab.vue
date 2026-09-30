<script>
import Decimal from "break_eternity.js";
import MassUpgradeRow from "@/components/MassUpgradeRow";

export default {
  name: "AtomicGeneratorTab",
  components: {
    MassUpgradeRow
  },
  data() {
    return {
      atomicPower: new Decimal(),
      gain: new Decimal(),
      free: new Decimal()
    };
  },
  computed: {
    cosmicRay() {
      return MassUpgrade.cosmicRay;
    }
  },
  methods: {
    update() {
      this.atomicPower.copyFrom(Currency.atomicPower.value);
      this.gain = Currency.atomicPower.gainedAmount;
      this.free = Atom.freeTickspeeds;
    }
  }
};
</script>

<template>
  <div>
    <div class="c-bh-info">
      <span>
        <i18n
          path="atomic_power_description"
          tag="span"
        >
          <template #atomicPower>
            <span class="o-highlight">
              {{ format(atomicPower) }}
            </span>
            <span>{{ formatGain(atomicPower, gain) }}</span>
          </template>
        </i18n>
      </span>
      <span class="c-green">{{ $t('atomic_power_free_tickspeeds', { free: format(free, 0) }) }}</span>
    </div>
    <MassUpgradeRow :upgrade="cosmicRay" />
  </div>
</template>