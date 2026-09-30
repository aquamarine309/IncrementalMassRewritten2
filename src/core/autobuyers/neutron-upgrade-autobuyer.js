import { AutobuyerState } from "./autobuyer";

export class NeutronUpgradeAutobuyerState extends AutobuyerState {
  get _upgrades() {
    return NeutronUpgradeType.normal;
  }

  get isActive() {
    return player.auto.neutronUpgrade;
  }

  set isActive(value) {
    player.auto.neutronUpgrade = value;
  }

  get canTick() {
    return this._upgrades !== undefined && super.canTick;
  }

  get isUnlocked() {
    return NeutronUpgrade.quQol1.isBought;
  }

  tick() {
    for (let i = 0; i < this._upgrades.length; i++) this._upgrades[i].purchase();
  }
}
