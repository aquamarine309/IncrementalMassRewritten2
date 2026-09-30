import { GameMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import { mlt } from "@/core/math";

export const Quantum = {
  get foamGain() {
    const mass = Currency.mass.value;
    if (mass.lt(this.requirement)) return DC.D0;
    let gain = mass.log10().div(DC.E13).pow(DC.D1_5);
    gain = gain.timesEffectsOf(
      NeutronUpgrade.qf1,
      NeutronUpgrade.qf2,
      NeutronUpgrade.qf3,
      QuantumMilestones.doubleQF
    );
    gain = gain.times(QuantumChallenges.effect);
    return gain.floor();
  },

  get requirement() {
    return mlt(DC.E4);
  },

  get speed() {
    return Currency.blueprint.value.add(1).log10().add(1).pow(DC.D1_5)
      .timesEffectOf(QuantumMilestones.removeReqAndSpeedUp)
      .dividedByEffectOf(QuantumChallenge(1));
  }
};

class QuantumMilestoneState extends GameMechanicState {
  get isReached() {
    return Currency.quantizes.gte(this.requirement);
  }

  get requirement() {
    return this.config.requirement;
  }

  get isEffectActive() {
    return this.isReached;
  }
}

export const QuantumMilestones = mapGameDataToObject(
  GameDatabase.quantum.milestones,
  config => new QuantumMilestoneState(config)
);