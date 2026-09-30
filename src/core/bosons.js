import { DC } from "./constants";
import { GameMechanicState, RebuyableMechanicState } from "./game-mechanics";

class BosonState extends GameMechanicState {
  constructor(config) {
    const configCopy = { ...config };
    const effect = config.effect;
    if (effect) {
      configCopy.effect = () => effect(this.amount);
    } else {
      const effects = config.effects;
      if (effects) {
        configCopy.effects = {};
        for (const key in effects) {
          const eff = effects[key];
          configCopy.effects[key] = () => eff(this.amount);
        }
      }
    }
    super(configCopy);
  }

  get amount() {
    return player.supernova.bosons[this.id];
  }

  set amount(value) {
    player.supernova.bosons[this.id] = value;
  }

  get gain() {
    return this.config.gain();
  }

  tick(diff) {
    this.amount = this.amount.add(this.gain.times(diff));
  }
}

export const Boson = mapGameDataToObject(
  GameDatabase.supernova.bosons,
  config => new BosonState(config)
);

export const Bosons = {
  get areUnlocked() {
    return PlayerProgress.quantumUnlocked() || Supernova.times.gte(DC.E1);
  },

  tick(diff) {
    if (!Bosons.areUnlocked) return;
    for (const boson of Boson.all) {
      boson.tick(diff);
    }
  }
};

class BosonUpgradeState extends RebuyableMechanicState {
  constructor(config, type) {
    const configCopy = { ...config };
    const effect = config.effect;
    const cost = config.cost;
    configCopy.effect = () => effect(this.boughtAmount);
    configCopy.cost = () => cost(this.boughtAmount);
    super(configCopy);
    this._type = type;
  }

  get type() {
    return this._type;
  }

  get boson() {
    return Boson[this.type];
  }

  get boughtAmount() {
    return player.supernova.bosonUpgrades[this.type][this.id];
  }

  set boughtAmount(value) {
    player.supernova.bosonUpgrades[this.type][this.id] = value;
  }

  get currency() {
    return this.boson.amount;
  }

  set currency(value) {
    this.boson.amount = value;
  }

  buyMax() {
    if (!this.canBeBought) return;
    const bulk = this.config.bulk(this.currency);
    if (bulk.lte(this.boughtAmount)) return;
    this.boughtAmount = bulk.minus(1).clampMin(0);
    this.purchase();
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (!this.isFree) {
      this.currency = this.currency.minus(this.cost);
    }
    this.boughtAmount = this.boughtAmount.add(1);
    this.onPurchased();
    GameUI.update();
    return true;
  }

  get isFree() {
    return NeutronUpgrade.qol7.canBeApplied;
  }

  get isEffectActive() {
    return Bosons.areUnlocked && !FermionType.quarks.fermions.top.canBeApplied;
  }
}

export const PhotonUpgrade = mapGameData(
  GameDatabase.supernova.bosonUpgrades.photon,
  config => new BosonUpgradeState(config, "photon")
);

export const GluonUpgrade = mapGameData(
  GameDatabase.supernova.bosonUpgrades.gluon,
  config => new BosonUpgradeState(config, "gluon")
);