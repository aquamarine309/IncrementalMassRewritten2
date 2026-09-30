import { DC } from "./constants";
import { GameMechanicState } from "./game-mechanics";

const RADIATION_BOOST_CONSTANTS = Array.range(0, 14).map(order => ({
  base: DC.D2.add(0.5 * order),
  pow: DC.D1_3.add(0.05 * order),
  mult: DC.E1.times(Math.pow(0.5 * order + 1, 2)),
}));

export const Radiation = {
  get isUnlocked() {
    return NeutronUpgrade.unl1.canBeApplied;
  },

  tick(diff) {
    if (!this.isUnlocked) return;
    for (let i = 0; i < RadiationType.all.length; i++) {
      RadiationType.all[i].tick(diff);
    }
    if (!Entropy.enthalpy.data.isActive) {
      Currency.frequency.tick(diff);
    }
  },

  get frequencyEffect() {
    if (!this.isUnlocked) return DC.D1;
    return Currency.frequency.value.add(1).cbrt().powEffectOf(EntropyRewards.radiation);
  }
};

class RadiationBoostState extends GameMechanicState {
  constructor(config, type) {
    const configCopy = { ...config };
    const effect = configCopy.effect;
    configCopy.description = () => this.description;
    configCopy.effect = () => effect(this.totalAmount);
    super(configCopy);
    this.type = type;
    this._totalAmountLazy = new Lazy(() => this.baseAmount.add(this.extraAmount))
      .invalidateOn(GAME_EVENT.GAME_TICK_AFTER);
  }

  get isEffectActive() {
    return this.type.isUnlocked && !FermionType.leptons.fermions.neutTau.canBeApplied;
  }

  get totalAmount() {
    return this._totalAmountLazy.value;
  }

  get baseAmount() {
    // If id is 0, when total is 1 or 4 or 7 ... can add one boost
    // If id is 1 or 2, just "translate" it to like id 0 by subtracting its id
    // Don't worry that it may cause amount negative, that's impossible
    return this.type.total.minus(this.id).add(2).div(3).floor();
  }

  get extraAmount() {
    let amount = DC.D0;
    if (this.type.id * 3 + this.id < 8) {
      amount = amount.plusEffectOf(RadiationType.infrared.boosts[2]);
    }
    if (this.type.id * 3 + this.id < 17) {
      amount = amount.plusEffectOf(RadiationType.xRay.boosts[2]);
    }
    amount = amount.plusEffectOf(Challenge(12).reward);
    if (NeutronUpgrade.rad6.canBeApplied) {
      amount = amount.times(DC.D1_6.minus(DC.D0_05.times(this.type.id)));
    }
    return amount;
  }

  get description() {
    return i18n.t(`radiation_${this.type.config.key}_boost_${this.id}_description`);
  }

  get title() {
    return i18n.t(`radiation_${this.type.config.key}_boost_${this.id}_title`);
  }
}

const _radiationCheap = new Lazy(() => Effects.product(
  NeutronUpgrade.rad3,
  FermionType.quarks.fermions.top.reward
)).invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

class RadiationTypeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.boosts = mapGameData(
      config.boosts,
      boostConfig => new RadiationBoostState(boostConfig, this)
    );
  }

  get name() {
    return i18n.t(this.config.key);
  }

  get requirement() {
    return this.config.requirement;
  }

  get isUnlocked() {
    return this.id === 0 || Currency.frequency.gte(this.requirement);
  }

  get effectValue() {
    if (!this.isUnlocked) return DC.D1;
    return this.distance.add(1).cbrt().powEffectOf(PrimordiumParticle.theta.effects[1]);
  }

  get isEffectActive() {
    return this.isUnlocked;
  }

  get data() {
    return player.supernova.radiation.unlocks[this.id];
  }

  get distance() {
    return this.data.distance;
  }

  set distance(value) {
    this.data.distance = value;
  }

  get amplitude() {
    return this.data.amplitude;
  }

  set amplitude(value) {
    this.data.amplitude = value;
  }

  get velocity() {
    return this.data.velocity;
  }

  set velocity(value) {
    this.data.velocity = value;
  }

  get total() {
    return this.amplitude.plus(this.velocity);
  }

  get distanceGain() {
    if (!this.isUnlocked) return DC.D0;
    let gain = DC.D1;
    if (this.id + 1 < RadiationType.all.length) {
      gain = gain.timesEffectOf(RadiationType.all[this.id + 1]);
    }
    gain = gain.timesEffectsOf(
      this.boosts[0],
      RankType.pent.unlocks.tetrBoostRadiation,
      NeutronUpgrade.rad2,
      NeutronUpgrade.rad5,
      PrimordiumParticle.theta.effects[0]
    );
    if (this.id + 1 < RadiationType.all.length && RadiationType.all[this.id + 1].isUnlocked) {
      gain = gain.timesEffectOf(NeutronUpgrade.rad1);
    }
    gain = gain.powEffectOf(QuantumChallenge(3));
    return gain;
  }

  get cheap() {
    return _radiationCheap.value;
  }

  boostCost(amount, idx) {
    const order = this.id * 2 + idx;
    const c = RADIATION_BOOST_CONSTANTS[order];
    const cheap = this.cheap;
    return c.base.pow(amount.div(cheap).pow(c.pow)).times(c.mult);
  }

  boostBulk(idx) {
    const order = this.id * 2 + idx;
    const base = DC.D2.add(0.5 * order);
    const pow = DC.D1_3.add(0.05 * order);
    const mult = DC.E1.times(Math.pow(0.5 * order + 1, 2));
    const cheap = this.cheap;
    const currency = this.distance;
    if (currency.lt(mult)) return DC.D0;
    return currency.div(mult).log(base).root(pow).times(cheap).floor().add(1);
  }

  get amplitudeCost() {
    return this.boostCost(this.amplitude, 0);
  }

  get velocityCost() {
    return this.boostCost(this.velocity, 1);
  }

  get amplitudeBulk() {
    return this.boostBulk(0);
  }

  get velocityBulk() {
    return this.boostBulk(1);
  }

  purchaseAmplitude() {
    const cost = this.amplitudeCost;
    if (this.distance.lt(cost)) return;
    const bulk = this.amplitudeBulk;
    this.distance = this.distance.minus(cost);
    this.amplitude = bulk;
  }

  purchaseVelocity() {
    const cost = this.velocityCost;
    if (this.distance.lt(cost)) return;
    const bulk = this.velocityBulk;
    this.distance = this.distance.minus(cost);
    this.velocity = bulk;
  }

  tick(diff) {
    if (!this.isUnlocked) return;
    this.distance = this.distance.add(this.distanceGain.times(diff));
  }

  reset() {
    this.distance = DC.D0;
    this.amplitude = DC.D0;
    this.velocity = DC.D0;
  }
}

export const RadiationType = mapGameDataToObject(
  GameDatabase.supernova.radiation,
  config => new RadiationTypeState(config)
);

window.one = DC.D1;