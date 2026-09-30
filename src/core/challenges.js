import { GameMechanicState } from "./game-mechanics";
import { deepmergeAll } from "@/utility/deepmerge";
import { DC } from "./constants";

class ChallengeRewardState extends GameMechanicState {
  constructor(config, challenge) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
    if (effect) {
      configCopy.effect = () => effect(challenge.effectiveCompletions);
    } else {
      const effects = {};
      for (const key in config.effects) {
        const fn = config.effects[key];
        effects[key] = () => fn(challenge.effectiveCompletions);
      }
      configCopy.effects = effects;
    }
    super(configCopy);
    this.challenge = challenge;
  }

  isEffectActive() {
    return this.challenge.completions.gt(0);
  }
}

class ChallengeMilestoneState extends GameMechanicState {
  constructor(config, challenge) {
    super(config);
    this.challenge = challenge;
  }

  get isEffectActive() {
    return this.challenge.completions.gte(this.requirement);
  }

  get requirement() {
    return this.config.requirement;
  }
}

class ChallengeState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.reward = new ChallengeRewardState(config.reward, this);
    this.milestones = mapGameData(
      config.milestones || [],
      milestoneConfig => new ChallengeMilestoneState(milestoneConfig, this)
    );
    this.registerEvents(this.type.event, () => this.reset());
  }

  get isRunning() {
    return player.challenges.current === this.id;
  }

  get forceRunning() {
    if (this.id <= 8 && Challenge(10).canBeApplied) return true;
    if ((this.id === 8 || this.id === 9) && FermionType.leptons.fermions.tau.canBeApplied) return true;
    if (this.id >= 3 && this.id <= 5 && FermionType.quarks.fermions.strange.isActive) return true;
    return false;
  }

  get completions() {
    return player.challenges.completions[this.id - 1];
  }

  set completions(value) {
    player.challenges.completions[this.id - 1] = value;
  }

  get effectiveCompletions() {
    if (FermionType.quarks.fermions.bottom.canBeApplied) return DC.D0;
    return this.completions.times(this.completionsMult);
  }

  get completionsMult() {
    if (this.id <= 8) return Chroma[2].effectOrDefault(DC.D1);
    return DC.D1;
  }

  get baseGoal() {
    return this.config.baseGoal;
  }

  get goalMult() {
    return this.config.goalMult;
  }

  get goalPow() {
    if (typeof this.config.goalPow === "function") {
      return this.config.goalPow();
    }
    return this.config.goalPow;
  }

  get currency() {
    return this.type.currency();
  }

  get hardenedStart() {
    if (this.id === 13 && this.id === 16) {
      return DC.D2;
    }
    if (this.id > 8) {
      return DC.E1;
    }
    return DC.D75;
  }

  get insaneStart() {
    if (this.id === 13 && this.id === 16) {
      return DC.D5;
    }
    if (this.id > 8) {
      return DC.D50;
    }
    if (this.id === 8) {
      return DC.D200;
    }
    return DC.D300;
  }

  get impossibleStart() {
    if (this.id === 13 && this.id === 16) {
      return DC.E1;
    }
    return DC.E3;
  }

  get hardenedPower() {
    if (this.id === 16) return DC.D1;
    return Effects.product(
      GameElement(2),
      GameElement(26)
    );
  }

  get insanePower() {
    return DC.D1;
  }

  get impossiblePower() {
    return DC.D1;
  }

  goalAt(completions) {
    const comps = completions.timesEffectOf(QuantumChallenge(5));
    if (completions.gte(this.impossibleStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      const exp2 = DC.D4_5.pow(this.insanePower);
      const exp3 = DC.D1_001.pow(this.impossiblePower);
      return this.baseGoal.times(this.goalMult.pow(
        exp3.pow(comps.minus(this.impossibleStart))
          .times(this.impossibleStart)
          .pow(exp2).div(this.insaneStart.pow(exp2.minus(1)))
          .pow(exp).div(this.hardenedStart.pow(exp.minus(1))).pow(this.goalPow)
      ));
    }
    if (completions.gte(this.insaneStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      const exp2 = DC.D4_5.pow(this.insanePower);
      return this.baseGoal.times(this.goalMult.pow(
        comps.pow(exp2).div(this.insaneStart.pow(exp2.minus(1)))
          .pow(exp).div(this.hardenedStart.pow(exp.minus(1))).pow(this.goalPow)
      ));
    }
    if (completions.gte(this.hardenedStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      return this.baseGoal.times(this.goalMult.pow(
        comps.pow(exp).div(this.hardenedStart.pow(exp.minus(1)))
          .pow(this.goalPow)));
    }
    return this.baseGoal.times(this.goalMult.pow(comps.pow(this.goalPow)));
  }

  get goal() {
    return this.goalAt(this.completions);
  }

  get max() {
    return this.config.max();
  }

  get isCapped() {
    return this.completions.gte(this.max);
  }

  start() {
    if (this.isRunning) return;
    if (Challenges.isRunning) {
      Challenges.current.exit();
    }
    this.config.type.reset();
    player.challenges.current = this.id;
  }

  exit() {
    if (!this.isCapped && this.currency.gte(this.goal)) {
      this.completions = this.pendingCompletions;
    }
    player.challenges.current = 0;
    this.config.type.reset();
  }

  reset() {
    this.completions = DC.D0;
  }

  get pendingCompletions() {
    if (this.currency.lt(this.goal) || this.isCapped) return this.completions;
    return this.bulkAt(this.currency);
  }

  bulkAt(mass) {
    const qc5 = QuantumChallenge(5).effectOrDefault(DC.D1);
    const impossibleStart = this.goalAt(this.impossibleStart);
    if (mass.gte(impossibleStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      const exp2 = DC.D4_5.pow(this.insanePower);
      const exp3 = DC.D1_001.pow(this.impossiblePower);
      return mass.div(this.baseGoal).log(this.goalMult).root(this.goalPow)
        .times(this.hardenedStart.pow(exp.minus(1))).root(exp)
        .times(this.insaneStart.pow(exp2.minus(1))).root(exp2)
        .div(this.impossibleStart)
        .max(1).log(exp3)
        .add(this.impossibleStart)
        .div(qc5)
        .add(1).floor().clampMax(this.max);
    }
    const insaneStart = this.goalAt(this.insaneStart);
    if (mass.gte(insaneStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      const exp2 = DC.D4_5.pow(this.insanePower);
      return mass.div(this.baseGoal).log(this.goalMult).root(this.goalPow)
        .times(this.hardenedStart.pow(exp.minus(1))).root(exp).add(1).floor()
        .times(this.insaneStart.pow(exp2.minus(1))).root(exp2).div(qc5).add(1).floor()
        .clampMax(this.impossibleStart).clampMax(this.max);
    }
    const hardenedStart = this.goalAt(this.hardenedStart);
    if (mass.gte(hardenedStart)) {
      const exp = DC.D3.pow(this.hardenedPower);
      return mass.div(this.baseGoal).log(this.goalMult).root(this.goalPow)
        .times(this.hardenedStart.pow(exp.minus(1))).root(exp).div(qc5).add(1).floor()
        .clampMax(this.insaneStart).clampMax(this.max);
    }
    return mass.div(this.baseGoal).log(this.goalMult).root(this.goalPow)
      .div(qc5).add(1).floor().clampMax(this.hardenedStart).clampMax(this.max);
  }

  applyAutoComplete() {
    if (this.isCapped || this.currency.lt(this.goal)) return;
    this.completions = this.pendingCompletions;
  }

  get isUnlocked() {
    return this.config.isUnlocked();
  }

  get name() {
    const name = i18n.t(`c${this.id}_name`);
    if (this.completions.gte(this.impossibleStart)) {
      return `${i18n.t("impossible")}${name}`;
    }
    if (this.completions.gte(this.insaneStart)) {
      return `${i18n.t("insane")}${name}`;
    }
    if (this.completions.gte(this.hardenedStart)) {
      return `${i18n.t("hardened")}${name}`;
    }
    return name;
  }

  get isEffectActive() {
    return this.isRunning || this.forceRunning;
  }

  get type() {
    return this.config.type;
  }
}

export const Challenge = ChallengeState.createAccessor(GameDatabase.challenges);

export const Challenges = {
  all: Challenge.index.compact(),

  get isUnlocked() {
    return player.records.maxMass.gte(DC.D1_5E136);
  },

  get current() {
    return Challenge(player.challenges.current);
  },

  get isRunning() {
    return player.challenges.current > 0;
  },

  applyAutoBulk() {
    const auto = [];
    if (NeutronUpgrade.quQol3.canBeApplied) {
      auto.push(1, 2, 3, 4);
    }
    if (NeutronUpgrade.quQol5.canBeApplied) {
      auto.push(5, 6, 7, 8);
    }
    for (const id of auto) {
      Challenge(id).applyAutoComplete();
    }
    if (NeutronUpgrade.qol6.canBeApplied && Challenges.isRunning) {
      Challenges.current.applyAutoComplete();
    }
  }
};

export const C16 = {
  _isActive: false,

  get isActive() {
    return this._isActive;
  },

  set isActive(value) {
    this._isActive = value;
  }
};