import { GameMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import Decimal from "break_eternity.js";

class FermionRewardState extends GameMechanicState {
  constructor(config, fermion) {
    const configCopy = { ...config };
    const effect = config.effect;
    configCopy.effect = () => effect(this.effectiveTier, this.currencyValue);
    super(configCopy);
    this._fermion = fermion;
  }

  get fermion() {
    return this._fermion;
  }

  get currencyValue() {
    if (this.fermion.type === FermionType.quarks && FermionType.quarks.fermions.top.canBeApplied) {
      return DC.D0;
    }
    if (this.fermion.type === FermionType.leptons && FermionType.leptons.fermions.neutMeon.canBeApplied) {
      return DC.D0;
    }
    return this.fermion.type.currency.value;
  }

  get effectiveTier() {
    let tier = this.fermion.tier.add(this.fermion.bonus);
    if (this.fermion.type === FermionType.leptons) {
      tier = tier.timesEffectOf(RadiationType.xRay.boosts[1]);
    } else {
      tier = tier.timesEffectOf(RadiationType.gammaRay.boosts[1]);
    }
    return tier;
  }

  get isEffectActive() {
    return this.fermion.tier.gt(DC.D0);
  }
}

class FermionState extends GameMechanicState {
  constructor(config, type) {
    super(config);
    this._reward = new FermionRewardState(config.reward, this);
    this._type = type;
    this.cachedRequirement = new Lazy(() => this.requirement);
  }

  get type() {
    return this._type;
  }

  get tier() {
    return player.supernova.fermions.tiers[this.id];
  }

  get bonus() {
    return PrimordiumParticle.epsilon.effects[1].effectOrDefault(DC.D0);
  }

  get reward() {
    return this._reward;
  }

  set tier(value) {
    player.supernova.fermions.tiers[this.id] = value;
  }

  get firstCheaper() {
    return NeutronUpgrade.qu1.effectOrDefault(DC.D1)
      .dividedByEffectOf(QuantumChallenge(2));
  }

  get requirement() {
    const tier = Scaling.fermion.scaleEvery(this.tier, false, [null, null, null, this.firstCheaper]);
    const baseReq = this.config.baseReq;
    const reqMult = this.config.reqMult;
    const reqPow = this.config.reqPow;
    return baseReq.times(reqMult.pow(tier.pow(reqPow)));
  }

  get currency() {
    return this.config.currency();
  }

  get isReached() {
    return this.currency.gte(this.cachedRequirement.value);
  }

  get bulk() {
    if (this.tier.gte(this.maxTier)) return this.maxTier;
    const baseReq = this.config.baseReq;
    const reqMult = this.config.reqMult;
    const reqPow = this.config.reqPow;
    if (this.currency.lt(baseReq)) {
      return DC.D0;
    }
    return Scaling.fermion.scaleEvery(
      this.currency.div(baseReq).log10().div(reqMult.log10())
        .root(reqPow),
      true,
      [null, null, null, this.firstCheaper]).floor().add(1).clampMax(this.maxTier);
  }

  get isActive() {
    return player.supernova.fermions.active === this.id;
  }

  updateTier() {
    if (!this.isReached) return;
    this.tier = this.bulk;
    this.cachedRequirement.invalidate();
    this.type.cachedTotalTiers.invalidate();
  }

  start() {
    if (!this.isUnlocked) return;
    Resets.supernova.resetLayer(true, true);
    player.supernova.fermions.active = this.id;
  }

  get isEffectActive() {
    return this.isActive;
  }

  get maxTier() {
    const maxTier = this.config.maxTier;
    if (typeof maxTier === "function") {
      return maxTier();
    }
    return Decimal.dInf;
  }

  get isUnlocked() {
    // Six Fermions are a group
    // The quarks' ids start from 0 and the leptons' start from 6
    return this.id % 6 < Fermions.unlockedCount;
  }

  reset() {
    this.tier = DC.D0;
    this.cachedRequirement.invalidate();
    this.type.cachedTotalTiers.invalidate();
  }
}

class FermionTypeState {
  constructor(config) {
    this._config = config;
    this._fermions = mapGameDataToObject(
      config.fermions,
      fermionConfig => new FermionState(fermionConfig, this)
    );
    this.cachedTotalTiers = new Lazy(() => this.fermions.all.map(x => x.tier).reduce((a, b) => a.add(b), DC.D0));
  }

  get id() {
    return this.config.id;
  }

  get config() {
    return this._config;
  }

  get currency() {
    return this.config.currency();
  }

  get fermions() {
    return this._fermions;
  }

  get totalTiers() {
    return this.cachedTotalTiers.value;
  }

  get pointGain() {
    if (!Fermions.areUnlocked) return DC.D0;
    let gain = DC.D1;
    const base = DC.D1_25.plusEffectOf(PrimordiumParticle.epsilon.effects[0]);
    gain = gain.times(base.pow(this.totalTiers));
    gain = gain.timesEffectOf(NeutronUpgrade.fn1);
    gain = gain.times(Radiation.frequencyEffect);
    return gain;
  }
}

export const FermionType = mapGameDataToObject(
  GameDatabase.supernova.fermions,
  config => new FermionTypeState(config)
);

export const Fermions = {
  all: FermionType.all.reduce((acc, type) => acc.concat(type.fermions.all), []),

  get isActive() {
    return player.supernova.fermions.active >= 0;
  },

  get current() {
    return this.all[player.supernova.fermions.active];
  },

  get areUnlocked() {
    return Challenge(10).milestones[0].canBeApplied || PlayerProgress.quantumUnlocked();
  },

  get unlockedCount() {
    let count = 2;
    if (NeutronUpgrade.fn2.canBeApplied) count++;
    if (NeutronUpgrade.fn6.canBeApplied) count++;
    if (NeutronUpgrade.fn7.canBeApplied) count++;
    if (NeutronUpgrade.fn8.canBeApplied) count++;
    return count;
  },

  invalidate() {
    for (const fermion of this.all) {
      fermion.cachedRequirement.invalidate();
    }
  },

  update(diff) {
    if (!this.areUnlocked) return;
    Currency.uQuarks.tick(diff);
    Currency.uLeptons.tick(diff);
    this.invalidate();
    if (NeutronUpgrade.quQol8.canBeApplied) {
      for (const fermion of this.all) {
        fermion.updateTier();
      }
    } else if (this.isActive) {
      this.current.updateTier();
    }
  }
};