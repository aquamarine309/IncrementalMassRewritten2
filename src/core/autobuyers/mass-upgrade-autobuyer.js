import { AutobuyerState } from "./autobuyer";

export class MassUpgradeAutobuyerState extends AutobuyerState {
  get _upgrade() { return MassUpgrade.all[this.id - 1]; }

  get name() {
    return this._upgrade.config.name;
  }

  get isActive() {
    return player.auto.massUpgrades[this._upgrade.id];
  }

  set isActive(value) {
    player.auto.massUpgrades[this._upgrade.id] = value;
  }

  get canTick() {
    return this._upgrade !== undefined && super.canTick;
  }

  get isUnlocked() {
    return this._upgrade.autoUnlocked;
  }

  tick() {
    this._upgrade.buyMax();
  }

  static get entryCount() { return 9; }
  static get autobuyerGroupName() { return "Mass Upgrades"; }
}
