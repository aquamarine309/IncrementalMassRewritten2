<script>
import Decimal from "break_eternity.js";
import PrimordiumRow from "./PrimordiumRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PrimordiumTab",
  components: {
    PrimordiumRow,
    PrimaryButton
  },
  data() {
    return {
      theorems: new Decimal(0),
      totalTheorems: new Decimal(0),
      currentBP: new Decimal(0),
      next: new Decimal(0)
    };
  },
  computed: {
    primordium: () => PrimordiumParticle.all
  },
  methods: {
    update() {
      this.theorems = Primordium.theorems;
      this.totalTheorems = Primordium.totalTheorems;
      this.currentBP.copyFrom(Currency.blueprint.value);
      this.next = Primordium.theoremAt(this.totalTheorems.add(1));
    },
    distribute(amount) {
      Primordium.distribute(amount);
    },
    respec() {
      Primordium.respec();
    }
  }
};
</script>

<template>
  <div>
    <b>{{ $tc(
      "you_have_X_primordium_theorem",
      checkSingle(theorems),
      { value: `${format(theorems, 0)} / ${format(totalTheorems, 0)}` }) }}</b>
    <div>Next Theorem at {{ format(next) }} Blueprint. (You have {{ format(currentBP) }})</div>
    <div>
      <PrimaryButton @click="distribute(1)">
        Give {{ formatInt(1) }} random particle
      </PrimaryButton>
      <PrimaryButton @click="distribute(10)">
        Give {{ formatInt(10) }} random particles
      </PrimaryButton>
      <PrimaryButton @click="distribute()">
        Give all random particles
      </PrimaryButton>
      <PrimaryButton @click="respec()">
        Respec all Particles
      </PrimaryButton>
    </div>
    <div>
      <PrimordiumRow
        v-for="particle of primordium"
        :key="particle.id"
        :particle="particle"
      />
    </div>
  </div>
</template>

<style scoped>

</style>