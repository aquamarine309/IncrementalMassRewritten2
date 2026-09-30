import { AutobuyerState } from "./autobuyer";

export class RadiationAutobuyerState extends AutobuyerState {
  get _radiation() {
    return RadiationType.all;
  }

  get isActive() {
    return player.auto.radiation;
  }

  set isActive(value) {
    player.auto.radiation = value;
  }

  get canTick() {
    return this._radiation !== undefined && super.canTick;
  }

  get isUnlocked() {
    return NeutronUpgrade.qol9.isBought;
  }

  tick() {
    for (let i = 0; i < this._radiation.length; i++) {
      const radiation = this._radiation[i];
      radiation.purchaseAmplitude();
      radiation.purchaseVelocity();
    }
  }
}
