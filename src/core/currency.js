import { DC } from "./constants";
import Decimal from "break_eternity.js";

/**
 * @abstract
 */
class MathOperations {
  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  add(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  subtract(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  multiply(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  divide(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  max(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  min(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  eq(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  gte(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lt(left, right) { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  lte(left, right) { throw new NotImplementedError(); }
}

MathOperations.number = new class NumberMathOperations extends MathOperations {
  add(left, right) { return left + right; }
  subtract(left, right) { return left - right; }
  multiply(left, right) { return left * right; }
  divide(left, right) { return left / right; }
  max(left, right) { return Math.max(left, right); }
  min(left, right) { return Math.min(left, right); }
  eq(left, right) { return left === right; }
  gt(left, right) { return left > right; }
  gte(left, right) { return left >= right; }
  lt(left, right) { return left < right; }
  lte(left, right) { return left <= right; }
}();

MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
  add(left, right) { return Decimal.add(left, right); }
  subtract(left, right) { return Decimal.subtract(left, right); }
  multiply(left, right) { return Decimal.multiply(left, right); }
  divide(left, right) { return Decimal.divide(left, right); }
  max(left, right) { return Decimal.max(left, right); }
  min(left, right) { return Decimal.min(left, right); }
  eq(left, right) { return Decimal.eq(left, right); }
  gt(left, right) { return Decimal.gt(left, right); }
  gte(left, right) { return Decimal.gte(left, right); }
  lt(left, right) { return Decimal.lt(left, right); }
  lte(left, right) { return Decimal.lte(left, right); }
}();

/**
 * @abstract
 */
export class Currency {
  /**
   * @abstract
   */
  get value() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   * @type {MathOperations}
   */
  get operations() { throw new NotImplementedError(); }

  _gainLazy = new Lazy(() => this.computeGain())
    .invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

  get gainedAmount() {
    return this._gainLazy.value;
  }

  computeGain() {
    throw new NotImplementedError();
  }

  add(amount) {
    this.value = this.operations.add(this.value, amount);
  }

  subtract(amount) {
    this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.divide(this.value, amount);
  }

  eq(amount) {
    return this.operations.eq(this.value, amount);
  }

  gt(amount) {
    return this.operations.gt(this.value, amount);
  }

  gte(amount) {
    return this.operations.gte(this.value, amount);
  }

  lt(amount) {
    return this.operations.lt(this.value, amount);
  }

  lte(amount) {
    return this.operations.lte(this.value, amount);
  }

  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.subtract(cost);
    return true;
  }

  bumpTo(value) {
    this.value = this.operations.max(this.value, value);
  }

  dropTo(value) {
    this.value = this.operations.min(this.value, value);
  }

  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }

  /**
   * @abstract
   */
  // eslint-disable-next-line no-unused-vars
  tick(diff) { throw new NotImplementedError(); }

  gain() {
    this.add(this.gainedAmount);
  }
}

/**
 * @abstract
 */
// eslint-disable-next-line no-unused-vars
class NumberCurrency extends Currency {
  get operations() { return MathOperations.number; }
  get startingValue() { return 0; }
  tick(diff) {
    this.add(this.gainedAmount * diff);
  }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get sign() { return this.value.sign; }
  get layer() { return this.value.layer; }
  get mag() { return this.value.mag; }
  get startingValue() { return DC.D0; }
  tick(diff) {
    this.add(this.gainedAmount.times(diff));
  }
}

window.DecimalCurrency = DecimalCurrency;

Currency.mass = new class extends DecimalCurrency {
  get value() {
    return player.mass;
  }

  set value(value) {
    player.mass = value;
    player.records.maxMass = player.records.maxMass.max(value);
  }

  computeGain() {
    let gain = DC.D1;
    gain = gain.plusEffectOf(MassUpgrade.muscler);
    gain = gain.timesEffectsOf(
      RankType.rank.unlocks.rankBoostsMass,
      RankType.rank.unlocks.tripleMassGain,
      RankType.rank.unlocks.massGain,
      MassUpgrade.tickspeed,
      BHUpgrade(9),
      NeutronUpgrade.m1,
      Boson.positiveW.effects.mass
    );
    gain = gain.times(BlackHole.mult);
    gain = gain.times(Atom.protonMass());
    gain = gain.times(Atom.neutronMass());
    gain = gain.times(Stars.boost);
    gain = gain.powEffectsOf(
      RankType.tier.unlocks.raiseMassGain,
      Challenge(3).reward,
      RankType.rank.unlocks.massGainPower
    );
    if (MassDilation.canBeApplied) {
      gain = dilatedValue(gain, MassDilation.power);
      gain = gain.powEffectOf(GameElement(28));
    }
    gain = gain.powEffectOf(QuantumChallenge(4));
    if (Challenge(9).canBeApplied) {
      gain = dilatedValue(gain, Challenge(9).effectValue);
    }
    // TODO: "MassSoftcap.length" should be modified to "5" (117th Element)
    for (let i = 0; i < MassSoftcap.length; i++) {
      gain = Softcap.power(
        gain,
        MassSoftcap[i].mass,
        MassSoftcap[i].effectValue
      );
    }
    return gain;
  }

  get key() {
    throw new Error("Please use \"formatMass\" method");
  }
}();

Currency.ragePowers = new class extends DecimalCurrency {
  get value() {
    return player.ragePowers;
  }

  set value(value) {
    player.ragePowers = value;
  }

  computeGain() {
    if (Currency.mass.lt(DC.E15) || Challenge(7).canBeApplied) return DC.D0;
    let gain = Currency.mass.value.div(DC.E15).cbrt();
    gain = gain.timesEffectsOf(
      RankType.rank.unlocks.doubleRPGain,
      RankType.tier.unlocks.tierBoostRP,
      RankType.rank.unlocks.rankBoostRP,
      BHUpgrade(5),
      NeutronUpgrade.rp1
    );
    gain = gain.times(Atom.neutronRP());
    gain = gain.powEffectsOf(
      BHUpgrade(7),
      Challenge(4).reward,
      PrimordiumParticle.alpha.effects[0],
      QuantumChallenge(4)
    );
    if (Challenge(4).canBeApplied) {
      gain = gain.pow(DC.D0_1);
    }
    if (MassDilation.canBeApplied) {
      gain = dilatedValue(gain, MassDilation.power);
    }
    return gain;
  }

  get key() {
    return "X_rage_power";
  }
}();

Currency.darkMatter = new class extends DecimalCurrency {
  get value() {
    return player.darkMatter;
  }

  set value(value) {
    player.darkMatter = value;
  }

  computeGain() {
    const c7Running = Challenge(7).canBeApplied;
    let gain = (c7Running
      ? Currency.mass.value.div(DC.E180)
      : Currency.ragePowers.value.div(DC.E20));
    gain = gain.root(4);
    gain = gain.timesEffectOf(NeutronUpgrade.bh1);
    if (c7Running) {
      gain = gain.root(6);
    }
    gain = gain.timesEffectOf(PhotonUpgrade[0]);
    gain = gain.times(Atom.electronDM());
    gain = gain.powEffectsOf(
      Challenge(8),
      Challenge(8).reward,
      PrimordiumParticle.omega.effects[0],
      QuantumChallenge(4)
    );
    if (MassDilation.canBeApplied) {
      gain = dilatedValue(gain, MassDilation.power);
    }
    return gain.floor();
  }

  get key() {
    return "X_dark_matter";
  }
}();

Currency.blackHole = new class extends DecimalCurrency {
  get value() {
    return player.blackHole;
  }

  set value(value) {
    player.blackHole = value;
  }

  computeGain() {
    return BlackHole.gain;
  }

  get key() {
    return "X_black_hole";
  }
}();

Currency.atoms = new class extends DecimalCurrency {
  get value() {
    return player.atoms;
  }

  set value(value) {
    player.atoms = value;
  }

  computeGain() {
    if (Challenge(12).canBeApplied) return DC.D0;
    const mass = BlackHole.mass;
    let gain = mass.div(DC.D1_5E156);
    if (gain.lt(1)) return DC.D0;
    gain = gain.pow(0.2);
    gain = gain.timesEffectsOf(
      RageUpgrade(14),
      GluonUpgrade[0]
    );
    gain = gain.powEffectsOf(
      GameElement(17),
      PrimordiumParticle.sigma.effects[0]
    );
    gain = gain.powEffectOf(QuantumChallenge(4));
    gain = dilatedValue(gain, FermionType.leptons.fermions.electron.effectOrDefault(DC.D1));
    return gain.floor();
  }

  get key() {
    return "X_atom";
  }
}();

Currency.quark = new class extends DecimalCurrency {
  get value() {
    return player.quark;
  }

  set value(value) {
    player.quark = value;
  }

  computeGain() {
    if (Challenge(12).canBeApplied) return DC.D0;
    const atoms = Currency.atoms.gainedAmount;
    if (atoms.lt(1)) return DC.D0;
    let gain = atoms.clampMin(1).log10();
    if (GameElement(1).canBeApplied) {
      gain = DC.D1_25.pow(gain);
    } else {
      gain = gain.pow(1.1).add(1);
    }
    gain = gain.timesEffectsOf(
      BHUpgrade(12),
      AtomUpgrade(7),
      RankType.rank.unlocks.quarkGain,
      GameElement(6),
      DilationUpgrade.quarkGain,
      DilationUpgrade.doubleQuark,
      GameElement(42),
      GameElement(67)
    );
    gain = gain.powEffectOf(GameElement(47));
    return gain.floor();
  }

  get key() {
    return "X_quark";
  }
}();

Currency.atomicPower = new class extends DecimalCurrency {
  get value() {
    return player.atomicPower;
  }

  set value(value) {
    player.atomicPower = value;
  }

  computeGain() {
    return Atom.gainedPower;
  }

  get key() {
    return "X_atomic_power";
  }
}();

Currency.relativisticParticles = new class extends DecimalCurrency {
  get value() {
    return player.dilation.particles;
  }

  set value(value) {
    player.dilation.particles = value;
  }

  computeGain() {
    return MassDilation.particleGain;
  }

  get key() {
    return "X_relativistic_particle";
  }
}();

Currency.dilatedMass = new class extends DecimalCurrency {
  get value() {
    return player.dilation.mass;
  }

  set value(value) {
    player.dilation.mass = value;
  }

  computeGain() {
    if (Challenge(11).isRunning) return DC.D0;
    let gain = Currency.relativisticParticles.value.pow(2);
    gain = gain.timesEffectsOf(
      GameElement(22),
      DilationUpgrade.doubleMass,
      GameElement(35),
      GameElement(40)
    );
    gain = gain.powEffectOf(GameElement(32));
    gain = gain.powEffectOf(QuantumChallenge(4));
    return gain;
  }

  get key() {
    return "X_dilated_mass";
  }
}();

Currency.stars = new class extends DecimalCurrency {
  get value() {
    return player.stars.amount;
  }

  set value(value) {
    player.stars.amount = value;
  }

  computeGain() {
    let gain = StarGenerator(0).amount;
    gain = gain.timesEffectOf(DilationUpgrade.starBoost);
    gain = Softcap.power(gain, Stars.softcapStart, DC.D0_75);
    return gain;
  }

  get key() {
    return "X_collapsed_star";
  }
}();

Currency.supernova = new class extends DecimalCurrency {
  get value() {
    return player.supernova.times;
  }

  set value(value) {
    player.supernova.times = value;
  }

  computeGain() {
    return Supernova.bulk.minus(this.value).clampMin(0);
  }

  get key() {
    return "X_supernova";
  }
}();

Currency.neutronStars = new class extends DecimalCurrency {
  get value() {
    return player.supernova.stars;
  }

  set value(value) {
    player.supernova.stars = value;
  }

  computeGain() {
    if (!NeutronUpgrade.c.canBeApplied) return DC.D0;
    let gain = DC.D0_1;
    gain = gain.timesEffectsOf(
      NeutronUpgrade.sn1,
      NeutronUpgrade.sn2,
      NeutronUpgrade.sn3,
      NeutronUpgrade.sn5,
      NeutronUpgrade.bs3,
      RadiationType.visible.boosts[2],
      QuantumMilestones.quantizesBoostStars
    );
    return gain;
  }

  get key() {
    return "X_neutron_star";
  }
}();

Currency.uQuarks = new class extends DecimalCurrency {
  get value() {
    return player.supernova.fermions.quarks;
  }

  set value(value) {
    player.supernova.fermions.quarks = value;
  }

  computeGain() {
    return FermionType.quarks.pointGain;
  }

  get key() {
    return "X_u_quark";
  }
}();

Currency.uLeptons = new class extends DecimalCurrency {
  get value() {
    return player.supernova.fermions.leptons;
  }

  set value(value) {
    player.supernova.fermions.leptons = value;
  }

  computeGain() {
    return FermionType.leptons.pointGain;
  }

  get key() {
    return "X_u_lepton";
  }
}();

Currency.frequency = new class extends DecimalCurrency {
  get value() {
    return player.supernova.radiation.frequency;
  }

  set value(value) {
    player.supernova.radiation.frequency = value;
  }

  computeGain() {
    if (!Radiation.isUnlocked) return DC.D0;
    let gain = DC.D1;
    gain = gain.timesEffectsOf(
      RadiationType.radio,
      NeutronUpgrade.rad1
    );
    gain = gain.powEffectOf(QuantumChallenge(3));
    return gain;
  }

  get key() {
    return "X_hz";
  }
}();

Currency.quantumFoam = new class extends DecimalCurrency {
  get value() {
    return player.quantum.foam;
  }

  set value(value) {
    player.quantum.foam = value;
  }

  computeGain() {
    return Quantum.foamGain;
  }

  get key() {
    return "X_quantum_foam";
  }
}();

Currency.quantizes = new class extends DecimalCurrency {
  get value() {
    return player.quantum.times;
  }

  set value(value) {
    player.quantum.times = value;
  }

  computeGain() {
    return Effects.product(
      NeutronUpgrade.qu7,
      NeutronUpgrade.qu9
    );
  }

  get key() {
    return null;
  }
}();

Currency.blueprint = new class extends DecimalCurrency {
  get value() {
    return player.quantum.blueprint;
  }

  set value(value) {
    player.quantum.blueprint = value;
  }

  computeGain() {
    let gain = DC.D1;
    gain = gain.timesEffectsOf(
      MassUpgrade.cosmicString,
      NeutronUpgrade.qu5
    );
    if (QuantumMilestones.speedBoost.canBeApplied) {
      gain = gain.times(Softcap.dilation(Quantum.speed.add(1).sqrt(), DC.E50, DC.D0_95));
    }
    return gain;
  }

  get key() {
    return "X_blueprint_particle";
  }
}();

Currency.entropy = new class extends DecimalCurrency {
  get value() {
    return player.quantum.entropy.amount;
  }

  set value(value) {
    player.quantum.entropy.amount = value.min(Entropy.cap);
  }

  computeGain() {
    return Entropy.gain;
  }
}();