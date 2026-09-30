<script>
import Decimal from "break_eternity.js";
import PrimaryButton from "@/components/PrimaryButton";
import ParitcleGrid from "./ParitcleGrid";

export default {
  name: "ParticlesTab",
  components: {
    PrimaryButton,
    ParitcleGrid
  },
  data() {
    return {
      quark: new Decimal(),
      inputs: [1, 1, 1],
      ratioMode: RATIO_MODE.SINGLE,
      canDistribute: false
    };
  },
  computed: {
    particles() {
      return Particles.all;
    },
    modeNames() {
      return ["+1", "25%", "100%"];
    },
    color() {
      return ["o-proton", "o-neutron", "o-electron"];
    }
  },
  watch: {
    ratioMode(value) {
      player.ratioMode = value;
    }
  },
  created() {
    this.inputs = player.particleWeights.slice();
  },
  methods: {
    update() {
      this.quark.copyFrom(Currency.quark.value);
      this.canDistribute = !Challenge(9).isRunning;
      this.ratioMode = player.ratioMode;
    },
    distribute() {
      Atom.distribute();
    },
    checkNumber(value) {
      return Number.isFinite(value) && value > 0;
    },
    updateValue(index) {
      const value = this.inputs[index];
      if (!this.checkNumber(value)) {
        this.inputs[index] = player.particleWeights[index];
        return;
      }
      player.particleWeights[index] = value;
    }
  }
};
</script>

<template>
  <div>
    <div>{{ $tc("you_have_X_unsigned_quark", checkSingle(quark), { value: format(quark, 0) }) }}</div>
    <div class="c-distribute-row">
      <PrimaryButton
        class="o-primary-btn--distribute"
        :enabled="canDistribute"
        @click="distribute"
      >
        {{ $t("distribute") }}
      </PrimaryButton>
    </div>
    <div class="c-weight-row">
      <input
        v-model.number="inputs[0]"
        type="number"
        class="o-weight-input o-proton"
        @blur="updateValue(0)"
      >
      <input
        v-model.number="inputs[1]"
        type="number"
        class="o-weight-input o-neutron"
        @blur="updateValue(1)"
      >
      <input
        v-model.number="inputs[2]"
        type="number"
        class="o-weight-input o-electron"
        @blur="updateValue(2)"
      >
    </div>
    <div>Ratio Mode: {{ modeNames[ratioMode] }}</div>
    <div>
      <PrimaryButton
        v-for="(name, index) of modeNames"
        :key="index"
        class="o-primary-btn--select-mode"
        @click="ratioMode = index"
      >
        {{ name }}
      </PrimaryButton>
    </div>
    <div class="c-particle-row">
      <ParitcleGrid
        v-for="(particle, index) of particles"
        :key="particle.id + 3"
        :particle="particle"
        :text-class="color[index]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-distribute-row {
  margin: 8px 0;
}

.o-primary-btn--distribute {
  padding: 5px 12px;
}

.o-primary-btn--select-mode {
  margin: 0 2px;
  padding: 5px 12px;
}

.c-weight-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.c-particle-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.o-weight-input {
  display: flex;
  background: none;
  max-width: 25%;
  border: 1px solid var(--color-accent);
  margin: 0 3px;
  font-family: BlobFont;
  outline: none;
}

.ad-ui .o-weight-input {
  border-radius: 3px;
}
</style>