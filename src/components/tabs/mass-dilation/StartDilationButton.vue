<script>
import Decimal from "break_eternity.js";

export default {
  name: "StartDilationButton",
  data() {
    return {
      isActive: false,
      requirement: new Decimal(),
      canGain: false,
      gain: new Decimal(),
      force: false
    };
  },
  computed: {
    text() {
      if (this.force) return "Mass Dilation is always active";
      if (this.isActive) {
        if (this.canGain) {
          return `Cancel for ${format(this.gain, 0)} Relativistic particles`;
        }
        return `Reach ${formatMass(this.requirement)} to gain Relativistic particles, or cancel dilation`;
      }
      return i18n.t("dilate_mass");
    }
  },
  methods: {
    update() {
      this.isActive = MassDilation.isActive;
      this.requirement = MassDilation.requirement;
      this.canGain = Currency.mass.gte(this.requirement);
      this.gain = MassDilation.particleGain;
      this.force = MassDilation.forceActive;
    },
    start() {
      MassDilation.toggle();
    }
  }
};
</script>

<template>
  <button
    class="o-start-dilation-btn"
    @click="start"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.o-start-dilation-btn {
  border: 1px solid var(--color-dilation);
  box-shadow: 0 0 5px 1px green inset;
  width: 180px;
  height: 100px;
  background-color: #171717;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin: 10px auto;
  font-family: BlobFont, "Xia Lu Wen Kai";
  padding: 5px;
}

.ad-ui .o-start-dilation-btn {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  font-weight: bold;
  color: var(--color-dilation);
  box-shadow: none;
}

.ad-ui.light-theme .o-start-dilation-btn {
  background-color: rgba(250, 250, 250, 0.87);
}
</style>