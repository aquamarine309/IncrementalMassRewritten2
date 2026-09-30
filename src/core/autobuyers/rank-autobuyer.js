import { AutobuyerState } from "./autobuyer";

export class RankAutobuyerState extends AutobuyerState {
  get _rank() { return RankType.all[this.id - 1]; }

  get name() {
    return this._rank.config.name;
  }

  get isActive() {
    return player.auto.ranks[this._rank.id];
  }

  set isActive(value) {
    player.auto.ranks[this._rank.id] = value;
  }

  get canTick() {
    return this._rank !== undefined && super.canTick && this._rank.canReset;
  }

  get isUnlocked() {
    return this._rank.autoUnlocked;
  }

  tick() {
    this._rank.bulk();
  }

  static get entryCount() { return 6; }
  static get autobuyerGroupName() { return "Ranks"; }
}
