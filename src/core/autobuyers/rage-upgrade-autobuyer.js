import { MainUpgradeAutobuyerState } from "./main-upgrade-autobuyer";

export class RageUpgradeAutobuyerState extends MainUpgradeAutobuyerState {
  get key() {
    return "rage";
  }

  get _upgrades() {
    return RageUpgrades.all;
  }

  get isUnlocked() {
    return BHUpgrade(4).canBeApplied;
  }
}