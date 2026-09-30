import { AutobuyerState } from "./autobuyer";

export class DilationUpgradeAutobuyerState extends AutobuyerState {
  get _upgrades() {
    return DilationUpgrade.all;
  }

  get isActive() {
    return player.auto.dilationUpgrades;
  }

  set isActive(value) {
    player.auto.dilationUpgrades = value;
  }

  get canTick() {
    return this._upgrades !== undefined && super.canTick;
  }

  get isUnlocked() {
    return GameElement(43).canBeApplied;
  }

  tick() {
    for (const upgrade of this._upgrades) upgrade.buyMax();
  }
}
