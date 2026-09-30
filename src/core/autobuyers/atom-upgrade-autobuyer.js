import { MainUpgradeAutobuyerState } from "./main-upgrade-autobuyer";

export class AtomUpgradeAutobuyerState extends MainUpgradeAutobuyerState {
  get key() {
    return "atom";
  }

  get _upgrades() {
    return AtomUpgrades.all;
  }

  get isUnlocked() {
    return NeutronUpgrade.qol1.isBought;
  }
}