import { AutobuyerState } from "./autobuyer";

export class QuantumAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.quantum;
  }

  get isActive() {
    return this.data.isActive;
  }

  set isActive(value) {
    this.data.isActive = value;
  }

  get canTick() {
    if (this.mode === AUTO_QUANTUM_TYPE.AMOUNT && Quantum.foamGain.lt(this.amount)) return false;
    if (this.mode === AUTO_QUANTUM_TYPE.TIME && this.timer < this.time) return false;
    if (!super.canTick || !Resets.quantum.canReset) return false;
    return true;
  }

  get isUnlocked() {
    return QuantumMilestones.quantizesBoostStars.canBeApplied;
  }

  get time() {
    return this.data.time;
  }

  get amount() {
    return this.data.amount;
  }

  get mode() {
    return this.data.mode;
  }

  set time(value) {
    this.data.time = value;
  }

  set amount(value) {
    this.data.amount = value;
  }

  set mode(value) {
    this.data.mode = value;
  }

  tick() {
    Resets.quantum.resetLayer();
  }

  get timer() {
    return player.time.quantum / 1000;
  }
}
