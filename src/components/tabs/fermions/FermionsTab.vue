<script>
import Decimal from "break_eternity.js";
import FermionBox from "./FermionBox";
import FermionInfo from "./FermionInfo";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "FermionsTab",
  components: {
    FermionBox,
    FermionInfo,
    PrimaryButton
  },
  data() {
    return {
      quarks: new Decimal(),
      leptons: new Decimal(),
      quarkGain: new Decimal(),
      leptonGain: new Decimal()
    };
  },
  computed: {
    selected() {
      return this.$viewModel.selectedFermionId;
    },
    quarkFermions() {
      return FermionType.quarks.fermions.all;
    },
    leptonFermions() {
      return FermionType.leptons.fermions.all;
    },
    quarkText() {
      return i18n.t("you_have_X", {
        value: i18n.tc("X_u_quark", checkSingle(this.quarks), {
          value: `${format(this.quarks)} ${formatGain(this.quarks, this.quarkGain)}`
        })
      });
    },
    leptonText() {
      return i18n.t("you_have_X", {
        value: i18n.tc("X_u_lepton", checkSingle(this.leptons), {
          value: `${format(this.leptons)} ${formatGain(this.leptons, this.leptonGain)}`
        })
      });
    },
  },
  methods: {
    update() {
      this.quarks.copyFrom(Currency.uQuarks.value);
      this.leptons.copyFrom(Currency.uLeptons.value);
      this.quarkGain = Currency.uQuarks.gainedAmount;
      this.leptonGain = Currency.uLeptons.gainedAmount;
    },
    backToNormal() {
      Resets.supernova.resetLayer(true, true);
    }
  }
};
</script>

<template>
  <div>
    <div>
      <PrimaryButton @click="backToNormal">
        Back To Normal
      </PrimaryButton>
    </div>
    <FermionInfo :selected="selected" />
    <div class="l-fermions-container l-fermions-container--quark">
      <div>{{ quarkText }}</div>
      <div class="c-fermions">
        <FermionBox
          v-for="fermion in quarkFermions"
          :key="fermion.id"
          :fermion="fermion"
        />
      </div>
    </div>
    <div class="l-fermions-container l-fermions-container--lepton">
      <div>{{ leptonText }}</div>
      <div class="c-fermions">
        <FermionBox
          v-for="fermion in leptonFermions"
          :key="fermion.id"
          :fermion="fermion"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>