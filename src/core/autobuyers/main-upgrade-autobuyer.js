import { AutobuyerState } from "./autobuyer";

export class MainUpgradeAutobuyerState extends AutobuyerState {
  get _upgrades() { throw new NotImplementedError(); }

  get key() { throw new NotImplementedError(); }

  get isActive() {
    return player.auto.mainUpgrades[this.key];
  }

  set isActive(value) {
    player.auto.mainUpgrades[this.key] = value;
  }

  get canTick() {
    return this._upgrades !== undefined && super.canTick;
  }

  get isUnlocked() { throw new NotImplementedError(); }

  tick() {
    for (const upgrade of this._upgrades) upgrade.purchase();
  }
}
