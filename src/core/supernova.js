import { DC } from "./constants";
import { SetPurchasableMechanicState } from "./game-mechanics";

export const Supernova = {
  get times() {
    return player.supernova.times;
  },

  requirementAt(value) {
    return DC.E20.pow(Scaling.supernova.scaleEvery(value).dividedByEffectOf(GluonUpgrade[3]).pow(DC.D1_25)).times(DC.E90);
  },

  get requirement() {
    return Supernova.requirementAt(Supernova.times);
  },

  bulkAt(value) {
    if (value.lt(DC.E90)) return DC.D0;
    return Scaling.supernova.scaleEvery(value.div(DC.E90).log10().div(DC.D20).pow(DC.D0_8).timesEffectOf(GluonUpgrade[3]), true).add(1).floor();
  },

  get tutorialActive() {
    return !PlayerProgress.quantumUnlocked() && Supernova.times.lt(this.tutorialCount);
  },

  get bulk() {
    const bulk = Supernova.bulkAt(Currency.stars.value);
    if (Supernova.tutorialActive) return bulk.clampMax(this.times.add(1));
    return bulk;
  },

  get tutorialCount() {
    return DC.E1;
  },

  startingAutoCheck() {
    if (Supernova.times.gte(DC.D1) && Supernova.tutorialActive && Resets.supernova.canReset && GameUI.initialized) {
      Resets.supernova.resetLayer();
      Tab.main.mass.show();
      GameUI.notify.supernova("You have become Supernova!");
      if (Supernova.times.eq(this.tutorialCount)) {
        Modal.message.show(`<h3>Congratulations!</h3><br>You have become ${formatInt(10)} Supernovas!<br>And you can manually supernova!<br><br>Bosons are unlocked in Supernova tab!`);
      }
    }
  }
};
class NeutronUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.pos = [null, null];
    this.formattedID = this.id.replace(/[A-Z]/gu, matched => `_${matched.toLowerCase()}`);
    const removeReq = ["qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "qol7", "qol8", "qol9", "unl1", "c", "s2", "s3", "s4", "sn3", "sn4", "t1", "bh2", "gr1", "chal1", "chal2", "chal3", "bs1", "fn2", "fn3", "fn5", "fn6", "fn10"];
    this.reqCanBeRemoved = removeReq.includes(this.id);
    this.type = config.type ?? NEUTRON_UPGRADE_TYPE.NORMAL;
  }

  get quantum() {
    return this.type === NEUTRON_UPGRADE_TYPE.QUANTUM;
  }

  get currency() {
    return this.quantum ? Currency.quantumFoam : Currency.neutronStars;
  }

  get set() {
    return player.supernova.tree;
  }

  get isUnlocked() {
    return this.config.isUnlocked?.() ?? true;
  }

  get reqRemoved() {
    return QuantumMilestones.removeReqAndSpeedUp.canBeApplied && this.reqCanBeRemoved;
  }

  get isSatisfied() {
    if (this.reqRemoved) return true;
    return this.config.check?.() ?? true;
  }

  get isAvailableForPurchase() {
    return this.isSatisfied && this.branchBought;
  }

  get branchBought() {
    return this.isUnlocked && this.config.branch.every(x => NeutronUpgrade[x].isBought);
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const NeutronUpgrade = mapGameDataToObject(
  GameDatabase.supernova.neutronUpgrades,
  config => new NeutronUpgradeState(config)
);

export const NeutronUpgradeConnections = NeutronUpgrade.all.filter(x => x.config.branch)
  .reduce((arr, x) => arr.concat(x.config.branch.map(id => [NeutronUpgrade[id], x])), []);

export const NeutronTreeData = {
  margin: 60,
  lineHeight: 70,
  width: 500,
  height: 500,
  marginTop: 30
};

class NeutronTreeState {
  constructor(config) {
    this.config = config;
    this.upgrades = [];
    for (let i = 0; i < config.layout.length; i++) {
      const row = config.layout[i];
      const len = row.length;
      for (let j = 0; j < len; j++) {
        if (row[j] === null) continue;
        const upgrade = NeutronUpgrade[row[j]];
        this.upgrades.push(upgrade);
        upgrade.pos[1] = NeutronTreeData.marginTop + NeutronTreeData.lineHeight * i;
        const offset = j - (len - 1) / 2;
        upgrade.pos[0] = NeutronTreeData.width / 2 + offset * NeutronTreeData.margin;
      }
    }
  }

  get isUnlocked() {
    return this.config.isUnlocked();
  }

  get id() {
    return this.config.id;
  }
}

export const NeutronTree = GameDatabase.supernova.neutronTrees.map(tree => new NeutronTreeState(tree));

export const NeutronUpgradeType = {
  normal: NeutronUpgrade.all.filter(upg => upg.type === NEUTRON_UPGRADE_TYPE.NORMAL),
  quantum: NeutronUpgrade.all.filter(upg => upg.type === NEUTRON_UPGRADE_TYPE.QUANTUM)
};