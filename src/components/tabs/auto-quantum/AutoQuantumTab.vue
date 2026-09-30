<script>
import Decimal from "break_eternity.js";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "AutoQuantumTab",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      auto: false,
      mode: AUTO_QUANTUM_TYPE.AMOUNT,
      amount: new Decimal(-1),
      time: 0,
      amountText: "",
      init: false,
      currentTime: 0,
      rate: new Decimal()
    };
  },
  computed: {
    buttonText() {
      const name = this.isAmount ? "Amount" : "Time";
      return i18n.t("auto_quantum_mode_X", { value: name });
    },
    isAmount() {
      return this.mode === AUTO_QUANTUM_TYPE.AMOUNT;
    }
  },
  watch: {
    auto(value) {
      Autobuyer.quantum.isActive = value;
    },
    mode(value) {
      Autobuyer.quantum.mode = value;
    },
    amount(value) {
      Autobuyer.quantum.amount.copyFrom(value);
      this.amountText = format(value, 0);
    },
    time(value) {
      Autobuyer.quantum.time = parseFloat(value);
    },
  },
  methods: {
    update() {
      this.auto = Autobuyer.quantum.isActive;
      this.mode = Autobuyer.quantum.mode;
      this.amount.copyFrom(Autobuyer.quantum.amount);
      this.time = Autobuyer.quantum.time;
      if (!this.init) {
        this.amountText = format(this.amount, 0);
        this.init = true;
      }
      this.currentTime = player.time.quantum / 1000;
      this.rate = Quantum.foamGain.div(Math.clampMin(this.currentTime, 0.01));
    },
    toggleMode() {
      if (this.isAmount) {
        this.mode = AUTO_QUANTUM_TYPE.TIME;
      } else {
        this.mode = AUTO_QUANTUM_TYPE.AMOUNT;
      }
    },
    updateAmount() {
      const amount = Decimal.fromString(this.amountText);
      if (!amount.isFinite() || amount.lt(0)) {
        this.amountText = format(this.amount, 0);
        return;
      }
      this.amount = amount;
    },
    formatTimeNoDecimals(time) {
      return TimeSpan.fromSeconds(time).toStringNoDecimals();
    }
  }
};
</script>

<template>
  <div>
    <div>You have spent {{ formatTimeNoDecimals(currentTime) }} in this quantum. ({{ format(rate) }} Foams / Sec)</div>
    <div class="o-auto-quantum-button-row">
      <PrimaryToggleButton
        v-model="auto"
        i18n-key="auto_quantum_X"
      />
      <PrimaryButton @click="toggleMode">
        {{ buttonText }}
      </PrimaryButton>
    </div>
    <div class="o-auto-quantum-inputs">
      <input
        v-if="isAmount"
        v-model="amountText"
        class="o-weight-input"
        @blur="updateAmount"
      >
      <input
        v-else
        v-model="time"
        class="o-weight-input"
        type="number"
      >
      <span v-if="isAmount">= {{ $tc("X_quantum_foam", checkSingle(amount), { value: format(amount, 0) }) }}</span>
      <span v-else>= {{ formatTimeNoDecimals(time) }}</span>
    </div>
  </div>
</template>

<style scoped>
.o-weight-input {
  display: flex;
  background: none;
  border: 1px solid var(--color-accent);
  margin: 0 6px;
  font-family: BlobFont;
  outline: none;
  color: var(--color-accent);
}

.ad-ui .o-weight-input {
  border-radius: 3px;
}

.o-auto-quantum-inputs {
  display: flex;
  flex-direction: row;
  margin: 5px 0;
}

.o-auto-quantum-button-row .o-primary-btn {
  margin: 0 5px;
}
</style>