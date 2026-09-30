import { MainUpgradeState } from "./main-upgrade-state";

class RageUpgradeState extends MainUpgradeState {
  get key() {
    return "rage";
  }

  get currency() {
    return Currency.ragePowers;
  }

  get noReset() {
    return this.id === 2 || this.id === 4 || this.id === 5;
  }
}

export const RageUpgrade = RageUpgradeState
  .createAccessor(GameDatabase.upgrades.main.rage);

export const RageUpgrades = {
  all: RageUpgrade.index,

  reset() {
    for (const upgrade of RageUpgrades.all) {
      if (!upgrade.noReset) upgrade.reset();
    }
  }
};