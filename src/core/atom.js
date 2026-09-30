import { DC } from "./constants";

export const Atom = {
  get atomicPower() {
    return Currency.atomicPower.value;
  },

  get gainedPower() {
    let power = MassUpgrade.cosmicRay.effectValue;
    power = power.timesEffectsOf(
      GameElement(3),
      GameElement(52),
      GluonUpgrade[0]
    );
    power = power.powEffectOf(QuantumChallenge(4));
    power = dilatedValue(power, FermionType.quarks.fermions.up.effectOrDefault(DC.D1));
    if (MassDilation.canBeApplied) {
      power = dilatedValue(power, MassDilation.power);
    }
    return power;
  },

  get freeTickspeeds() {
    const base = GameElement(23).effectOrDefault(DC.D1_75);
    let ticks = Atom.atomicPower.clampMin(1).log(base);
    ticks = ticks.powEffectOf(EntropyRewards.accelerator);
    if (!GameElement(75).canBeApplied) {
      ticks = Softcap.power(ticks, DC.D5E4, DC.D0_75);
      ticks = Softcap.power(ticks, DC.D4E6, DC.D0_25);
    }
    ticks = Softcap.power(ticks, DC.E10, DC.D0_1);
    ticks = Softcap.power(ticks, DC.D2_5E35, DC.D0_1);
    return ticks.floor();
  },

  tick(diff) {
    for (const particle of Particles.all) {
      particle.tick(diff);
    }
  },

  distribute() {
    if (Challenge(9).canBeApplied) return;
    const weights = player.particleWeights;
    const sum = weights.sum();
    const quark = Currency.quark.value;
    if (quark.lt(sum)) return;
    const part = quark.div(sum).floor();
    for (let i = 0; i < 3; i++) {
      Particles.all[i].amount = Particles.all[i].amount.add(part.times(weights[i]));
    }
    Currency.quark.subtract(part.times(sum));
  },

  protonMass() {
    return Particles.proton.power.add(1).pow(3);
  },

  protonTick() {
    const value = Particles.proton.power.add(1).log2();
    if (GameElement(29).canBeApplied) {
      return value.pow(1.25).times(0.01);
    }
    return value.times(0.025);
  },

  neutronRP() {
    return Particles.neutron.power.add(1).pow(2);
  },

  neutronMass() {
    let power = Currency.ragePowers.value.max(1).log10().times(Particles.neutron.power.max(1).log10());
    if (GameElement(19).canBeApplied) {
      power = power.root(2.75);
    } else {
      power = power.div(4).cbrt();
    }
    return Currency.mass.value.max(1).log10().add(1).pow(power).clampMax(DC.EE200);
  },

  electronDM() {
    return Particles.electron.power.add(1);
  },

  electronCondenser() {
    const value = Particles.electron.power.add(1).log2();
    if (GameElement(30).canBeApplied) {
      return value.pow(1.2).times(0.01);
    }
    return value.times(0.02);
  }
};

class ParticleState {
  constructor(config) {
    this._id = config.id;
    this._config = config;
  }

  get id() {
    return this._id;
  }

  get config() {
    return this._config;
  }

  get amount() {
    return player.particles[this.id];
  }

  set amount(value) {
    player.particles[this.id] = value;
  }

  get power() {
    return player.particlePowers[this.id];
  }

  set power(value) {
    player.particlePowers[this.id] = value;
  }

  get gainPerSecond() {
    let gain = this.amount;
    if (GameElement(12).canBeApplied) {
      gain = gain.pow(Softcap.power(gain.add(1).log10().add(1).pow(DC.D0_25.timesEffectOf(Challenge(9).reward)), DC.D4E4, DC.D0_1));
    } else {
      gain = gain.pow(2);
    }
    gain = gain.timesEffectOf(AtomUpgrade(6));
    gain = Softcap.dilation(gain, DC.E3_8E4, DC.D0_9);
    gain = Softcap.dilation(gain, DC.E1_6E5, DC.D0_9);
    if (GameElement(61).canBeApplied) {
      gain = gain.times(this.amount.add(1).sqrt());
    }
    gain = Softcap.dilation(gain, DC.EE11, DC.D0_9);
    gain = Softcap.dilation(gain, DC.EE13, DC.D0_9);
    gain = gain.powEffectOf(QuantumChallenge(4));
    return gain;
  }

  tick(diff) {
    this.power = this.power.add(this.gainPerSecond.times(diff));
  }

  assign() {
    if (Challenge(9).canBeApplied) return;
    const quark = Currency.quark.value;
    if (quark.lte(0)) return;
    let assigned;
    switch (player.ratioMode) {
      case RATIO_MODE.SINGLE:
        assigned = DC.D1;
        break;
      case RATIO_MODE.QUARTER:
        assigned = quark.times(DC.D0_25).ceil();
        break;
      case RATIO_MODE.ALL:
        assigned = quark;
        break;
    }
    Currency.quark.subtract(assigned);
    this.amount = this.amount.add(assigned);
  }

  reset() {
    this.amount = DC.D0;
    this.power = DC.D0;
  }
}

export const Particles = mapGameDataToObject(
  GameDatabase.particles,
  config => new ParticleState(config)
);