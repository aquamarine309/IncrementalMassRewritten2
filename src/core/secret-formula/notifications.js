export const notifications = [
  {
    tab: ["upgrades", "rage"],
    condition: () => PlayerProgress.rageUnlocked() && !Autobuyer.rageUpgrade.isActive && RageUpgrades.all.some(x => x.canBeBought)
  },
  {
    tab: ["upgrades", "black_hole"],
    condition: () => PlayerProgress.blackHoleUnlocked() && !Autobuyer.blackHoleUpgrade.isActive && BHUpgrades.all.some(x => x.canBeBought)
  },
  {
    tab: ["upgrades", "atom"],
    condition: () => PlayerProgress.atomUnlocked() && !Autobuyer.atomUpgrade.isActive && AtomUpgrades.all.some(x => x.canBeBought)
  },
  {
    tab: ["atom", "elements"],
    condition: () => GameElements.isUnlocked && !Autobuyer.element.isActive && GameElements.all.some(x => x.isUnlocked && x.canBeBought)
  },
  {
    tab: ["supernova", "neutron_tree"],
    condition() {
      if (!PlayerProgress.supernovaUnlocked()) return false;
      if (!Autobuyer.neutronUpgrade.isActive && NeutronUpgradeType.normal.some(x => x.canBeBought)) {
        return true;
      }
      if (NeutronUpgradeType.quantum.some(x => x.canBeBought)) return true;
      return false;
    }
  },
  {
    tab: ["main", "mass"],
    condition: () => MassUpgrade.tickspeed.boughtAmount.eq(0) && MassUpgrade.tickspeed.canBeBought
  },
  {
    tab: ["main", "black_hole"],
    condition: () => MassUpgrade.condenser.boughtAmount.eq(0) && MassUpgrade.condenser.canBeBought
  },
  {
    tab: ["main", "atomic_generator"],
    condition: () => MassUpgrade.cosmicRay.boughtAmount.eq(0) && MassUpgrade.cosmicRay.canBeBought
  },
  {
    tab: ["quantum", "chroma"],
    condition: () => Chroma.some(x => x.canBeUnlocked)
  },
  {
    tab: ["main", "stars"],
    condition: () => Stars.isUnlocked && StarGenerators.next && !StarGenerators.auto && StarGenerators.next.canBeUnlocked
  },
  {
    tab: ["main", "stars"],
    condition: () => MassUpgrade.starBooster.boughtAmount.eq(0) && MassUpgrade.starBooster.canBeBought
  },
];