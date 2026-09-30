import { RankAutobuyerState } from "./rank-autobuyer";
import { MassUpgradeAutobuyerState } from "./mass-upgrade-autobuyer";
import { RageUpgradeAutobuyerState } from "./rage-upgrade-autobuyer";
import { BlackHoleUpgradeAutobuyerState } from "./black-hole-upgrade-autobuyer";
import { DilationUpgradeAutobuyerState } from "./dilation-upgrade-autobuyer";
import { AtomUpgradeAutobuyerState } from "./atom-upgrade-autobuyer";
import { ElementAutobuyerState } from "./element-autobuyer";
import { BosonUpgradeAutobuyerState } from "./boson-upgrade-autobuyer";
import { RadiationAutobuyerState } from "./radiation-autobuyer";
import { NeutronUpgradeAutobuyerState } from "./neutron-upgrade-autobuyer";
import { QuantumAutobuyerState } from "./quantum-autobuyer";

export const Autobuyer = {
  rank: RankAutobuyerState.createAccessor(),

  massUpgrade: MassUpgradeAutobuyerState.createAccessor(),

  rageUpgrade: new RageUpgradeAutobuyerState(),

  blackHoleUpgrade: new BlackHoleUpgradeAutobuyerState(),

  dilationUpgrade: new DilationUpgradeAutobuyerState(),

  atomUpgrade: new AtomUpgradeAutobuyerState(),

  element: new ElementAutobuyerState(),

  bosonUpgrade: new BosonUpgradeAutobuyerState(),

  radiation: new RadiationAutobuyerState(),

  neutronUpgrade: new NeutronUpgradeAutobuyerState(),

  quantum: new QuantumAutobuyerState()
};

export const Autobuyers = {
  all: [
    ...Autobuyer.rank.zeroIndexed,
    ...Autobuyer.massUpgrade.zeroIndexed,
    Autobuyer.rageUpgrade,
    Autobuyer.blackHoleUpgrade,
    Autobuyer.dilationUpgrade,
    Autobuyer.atomUpgrade,
    Autobuyer.element,
    Autobuyer.bosonUpgrade,
    Autobuyer.radiation,
    Autobuyer.neutronUpgrade,
    Autobuyer.quantum
  ],
  tick() {
    for (const autobuyer of Autobuyers.all) {
      if (autobuyer.canTick) autobuyer.tick();
    }
  }
};