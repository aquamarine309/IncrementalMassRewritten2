import { MainUpgradeState } from "./main-upgrade-state";

class BHUpgradeState extends MainUpgradeState {
  get key() {
    return "blackHole";
  }

  get currency() {
    return Currency.darkMatter;
  }

  get noReset() {
    return this.id === 4;
  }
}

export const BHUpgrade = BHUpgradeState
  .createAccessor(GameDatabase.upgrades.main.blackHole);

export const BHUpgrades = {
  all: BHUpgrade.index,

  reset() {
    for (const upgrade of BHUpgrades.all) {
      if (!upgrade.noReset) upgrade.reset();
    }
  }
};