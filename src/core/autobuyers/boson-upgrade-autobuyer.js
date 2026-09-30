import { AutobuyerState } from "./autobuyer";

export class BosonUpgradeAutobuyerState extends AutobuyerState {
  get _bosons() {
    return PhotonUpgrade.concat(GluonUpgrade);
  }

  get isActive() {
    return player.auto.bosonUpgrades;
  }

  set isActive(value) {
    player.auto.bosonUpgrades = value;
  }

  get canTick() {
    return this._bosons !== undefined && super.canTick;
  }

  get isUnlocked() {
    return NeutronUpgrade.qol7.isBought;
  }

  tick() {
    for (let i = 0; i < this._bosons.length; i++) this._bosons[i].buyMax();
  }
}
