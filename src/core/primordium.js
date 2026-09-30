import { GameMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import Decimal from "break_eternity.js";

class PrimordiumEffectState extends GameMechanicState {
  constructor(config, primordium) {
    const configCopy = { ...config };
    const description = config.description;
    const effect = config.effect;
    configCopy.description = () => description(this.effectValue);
    configCopy.effect = () => effect(this.primordium.amount);
    super(configCopy);
    this.primordium = primordium;
  }

  get isUnlocked() {
    return this.config.isUnlocked?.() ?? true;
  }

  get isEffectActive() {
    return this.isUnlocked && this.primordium.amount.gt(0);
  }
}

class PrimordiumState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.effects = config.effectList.map(
      effect => new PrimordiumEffectState(effect, this)
    );
  }

  get amount() {
    return player.quantum.primordium[this.id];
  }

  set amount(value) {
    player.quantum.primordium[this.id] = value;
  }

  add(value) {
    this.amount = this.amount.add(value);
  }

  reset() {
    this.amount = DC.D0;
  }

  get weight() {
    return this.config.weight;
  }

  get name() {
    return i18n.t("X_particle", { value: i18n.t(`primordium_${this.config.key}`) });
  }

  get symbol() {
    return this.config.symbol;
  }
}

export const PrimordiumParticle = mapGameDataToObject(
  GameDatabase.quantum.primordium,
  config => new PrimordiumState(config)
);

export const Primordium = {
  _totalWeight: new Lazy(() => PrimordiumParticle.all.map(x => x.weight).sum()),

  _spentTheorems: new Lazy(() => PrimordiumParticle.all.map(x => x.amount).reduce(Decimal.sumReducer)),

  get totalWeight() {
    return this._totalWeight;
  },

  get spentTheorems() {
    return this._spentTheorems;
  },

  get isUnlocked() {
    return NeutronUpgrade.unl2.canBeApplied;
  },

  get theoremBase() {
    return DC.D5.minusEffectOf(NeutronUpgrade.prim1);
  },

  theoremFrom(blueprint) {
    return blueprint.clampMin(1).log(this.theoremBase).times(2).floor();
  },

  theoremAt(theorem) {
    return this.theoremBase.pow(theorem.div(2));
  },

  get totalTheorems() {
    return this.theoremFrom(Currency.blueprint.value);
  },

  get theorems() {
    return this.totalTheorems.minus(this.spentTheorems.value);
  },

  distribute(amount) {
    const value = amount ? this.theorems.min(amount) : this.theorems;
    const totalWeight = this.totalWeight.value;
    if (totalWeight === 0) return;
    const weights = [];
    for (const particle of PrimordiumParticle.all) {
      weights.push(particle.weight + (weights[weights.length - 1] ?? 0));
    }
    let left = value.toNumber();
    while (left > 0) {
      left--;
      const uniform = Math.random() * totalWeight;
      for (let i = 0; i < weights.length; i++) {
        if (uniform < weights[i]) {
          PrimordiumParticle.all[i].add(DC.D1);
          break;
        }
      }
    }
    this.spentTheorems.invalidate();
  },

  respec() {
    Resets.quantum.resetLayer(true);
    for (const particle of PrimordiumParticle.all) {
      particle.reset();
    }
    this.spentTheorems.invalidate();
  }
};