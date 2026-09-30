<script>
import Decimal from "break_eternity.js";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EvaproationButton",
  components: {
    PrimaryButton
  },
  props: {
    evaporation: {
      type: Object,
      required: true
    },
    resName: {
      type: String,
      required: true
    },
    gainName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isActive: false,
      gain: new Decimal()
    };
  },
  computed: {
    buttonText() {
      if (!this.isActive) {
        return i18n.t("evaporate_X_to_get_Y", {
          value1: this.resName,
          value2: this.gainName
        });
      }
      return i18n.t("stop_evaporating", {
        value2: this.gainName,
        value1: format(this.gain)
      });
    }
  },
  methods: {
    update() {
      this.isActive = this.evaporation.data.isActive;
      if (this.isActive) {
        this.gain.copyFrom(this.evaporation.data.gain);
      }
    },
    toggle() {
      this.evaporation.toggle();
    }
  }
};
</script>

<template>
  <PrimaryButton
    class="c-evaporation-button"
    @click="toggle"
  >
    {{ buttonText }}
  </PrimaryButton>
</template>

<style scoped>
.c-evaporation-button {
  width: 100%;
  pending: 6px 5px;
  height: 70px;
  margin: 5px 0;
}
</style>