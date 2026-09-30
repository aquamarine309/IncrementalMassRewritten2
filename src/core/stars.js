import { DC } from "./constants";

export const Stars = {
  get isUnlocked() {
    return GameElement(36).canBeApplied;
  },

  get boost() {
    const mult2 = GameElement(76).effectOrDefault(DC.D1);
    const mult1 = GameElement(48).effectOrDefault(DC.D1).times(mult2);
    const rank = Softcap.power(RankType.rank.amount, DC.D2_5E6, DC.D0_25).times(mult1);
    const tier = Softcap.power(RankType.tier.amount, DC.D1_5E5, DC.D0_25).times(mult1);
    let tetr = Softcap.power(RankType.tetr.amount, DC.D3E4, DC.D0_15).times(mult1);
    tetr = Softcap.mult(tetr, DC.D5, NeutronUpgrade.s2.effectOrDefault(DC.D0_2));
    tetr = Softcap.power(tetr, DC.D9, DC.D0_3);
    const pent = (
      GameElement(69).canBeApplied
        ? Softcap.power(RankType.pent.amount.times(mult2), DC.D9, DC.D0_5)
        : DC.D0
    );
    let boost = Currency.stars.value.times(mult1).max(1).log10().add(1).pow(
      rank.times(tier.pow(2)).add(1).pow(tetr.add(1).pow(5 / 9).times(0.25)
        .times(pent.pow(0.85).times(0.0125).add(1))));
    boost = Softcap.dilation(boost, DC.EE15, DC.D0_95);
    boost = Softcap.dilation(boost, DC.E5E22, DC.D0_95);
    boost = Softcap.dilation(boost, DC.EE24, DC.D0_91);
    boost = Softcap.dilation(boost, DC.EE70, DC.D0_91);
    return boost;
  },

  get softcapStart() {
    return DC.E1000.powEffectOf(FermionType.leptons.fermions.electron.reward);
  }
};

const _starGenPower = new Lazy(() => {
  let p = FermionType.leptons.fermions.neutrino
    .effectOrDefault(DC.D1_5)
    .timesEffectsOf(GameElement(50), NeutronUpgrade.s3);
  if (p.gt(1)) {
    p = p.powEffectOf(QuantumChallenge(0).effects.generators);
  }
  return p;
}).invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

const _starGenMultiplier = new Lazy(() => DC.D1.timesEffectsOf(
  DilationUpgrade.starBoost,
  GameElement(54),
  PhotonUpgrade[3],
  MassUpgrade.starBooster
)).invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

class StarGeneratorState {
  constructor(tier) {
    const GENERATOR_COSTS = [DC.E225, DC.E280, DC.E320, DC.E430, DC.E870];
    this._cost = GENERATOR_COSTS[tier];
    this.tier = tier;
  }

  static createAccessor() {
    const index = Array.range(0, 5).map(tier => new this(tier));
    const accessor = tier => index[tier];
    accessor.index = index;
    return accessor;
  }

  get cost() {
    return this._cost;
  }

  get amount() {
    return player.stars.generators[this.tier];
  }

  set amount(value) {
    player.stars.generators[this.tier] = value;
  }

  get isUnlocked() {
    return StarGenerators.unlocked >= this.tier;
  }

  get canBeUnlocked() {
    return !this.isUnlocked && Currency.quark.gte(this.cost);
  }

  unlock() {
    if (!this.canBeUnlocked) return;
    Currency.quark.subtract(this.cost);
    player.stars.unlocked = this.tier;
  }

  get gainPerSecond() {
    if (!this.isUnlocked) return DC.D0;
    let power = _starGenPower.value;
    if (power.gt(1)) {
      power = power.powEffectOf(QuantumChallenge(0).effects.generators);
    }
    let gain = (this.tier === 4 ? DC.D0 : StarGenerator(this.tier + 1).amount).add(1).pow(power);
    if (this.tier === 4) {
      gain = gain.timesEffectsOf(
        GameElement(49),
        NeutronUpgrade.s1
      );
    }
    gain = gain.times(_starGenMultiplier.value);
    if (QuantumChallenges.isActive) {
      gain = dilatedValue(gain, QuantumChallenge(0).effects.stars.effectValue);
    }
    return gain;
  }

  gainForDiff(diff) {
    return this.gainPerSecond.times(diff);
  }

  reset() {
    this.amount = DC.D0;
  }
}

export const StarGenerator = StarGeneratorState.createAccessor();

export const StarGenerators = {
  all: StarGenerator.index,

  get unlocked() {
    return player.stars.unlocked;
  },

  get next() {
    return StarGenerator(StarGenerators.unlocked + 1);
  },

  get auto() {
    return NeutronUpgrade.qol4.isBought;
  },

  tick(diff) {
    if (StarGenerators.auto) {
      while (StarGenerators.next?.canBeUnlocked) {
        StarGenerators.next.unlock();
      }
    }
    for (let i = 0; i < 5; i++) {
      const generator = StarGenerator(i);
      generator.amount = generator.amount.add(generator.gainForDiff(diff));
    }
    Currency.stars.tick(diff);
  }
};