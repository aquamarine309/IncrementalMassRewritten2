import { MainUpgradeAutobuyerState } from "./main-upgrade-autobuyer";

export class BlackHoleUpgradeAutobuyerState extends MainUpgradeAutobuyerState {
  get key() {
    return "blackHole";
  }

  get _upgrades() {
    return BHUpgrades.all;
  }

  get isUnlocked() {
    return AtomUpgrade(1).canBeApplied;
  }
}