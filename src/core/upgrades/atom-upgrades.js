import { MainUpgradeState } from "./main-upgrade-state";

class AtomUpgradeState extends MainUpgradeState {
  get key() {
    return "atom";
  }

  get currency() {
    return Currency.atoms;
  }

  get noReset() {
    return this.id === 1 || this.id === 4 || this.id === 5 && NeutronUpgrade.qol2.isBought;
  }
}

export const AtomUpgrade = AtomUpgradeState
  .createAccessor(GameDatabase.upgrades.main.atom);

export const AtomUpgrades = {
  all: AtomUpgrade.index,

  reset() {
    for (const upgrade of AtomUpgrades.all) {
      if (!upgrade.noReset) upgrade.reset();
    }
  }
};