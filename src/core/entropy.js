import { DC } from "./constants";
import { GameMechanicState } from "./game-mechanics";
import Decimal from "break_eternity.js";
import { mlt, getLinearCost, getLinearBulk } from "@/core/math";

export function checkEntropy() {
  if (!GameUI.initialized) return;
  const req = mlt(DC.D7_5E6);
  if (Currency.mass.gte(req)) {
    player.unlocks.entropy = true;
    Modal.message.show(`<h3>Congratulations!</h3><br>You have reached ${formatMass(req)} of Mass!<br><br>Entropy is unlocked in Quantum tab!`);
  }
}

class EntropyRewardState extends GameMechanicState {
  constructor(config) {
    const configCopy = { ...config };
    const effect = config.effect;
    configCopy.effect = () => effect(this.amount);
    super(configCopy);
  }

  get amount() {
    return player.quantum.entropy.rewards[this.id];
  }

  set amount(value) {
    player.quantum.entropy.rewards[this.id] = value;
  }

  get baseReq() {
    return this.config.baseReq;
  }

  get reqMult() {
    return this.config.reqMult;
  }

  get scaleStart() {
    if (!this.config.scale) return null;
    return this.config.scale.start;
  }

  get scaleEffect() {
    if (!this.config.scale) return null;
    return this.config.scale.effect;
  }

  get nextReq() {
    let amount = this.amount;
    if (this.scaleStart) {
      amount = scaleValue(
        amount,
        this.scaleStart,
        this.scaleEffect,
        SCALE_TYPE.POWER
      );
    }
    return getLinearCost(amount, this.baseReq, this.reqMult);
  }

  get pendingAmount() {
    let amount = getLinearBulk(Currency.entropy.value, this.baseReq, this.reqMult);
    if (amount.eq(0)) return DC.D0;
    if (this.scaleStart) {
      amount = scaleValue(
        amount,
        this.scaleStart,
        this.scaleEffect,
        SCALE_TYPE.POWER,
        true
      );
    }
    return amount.add(1).floor();
  }

  updateAmount() {
    this.amount = this.amount.max(this.pendingAmount);
  }
}

/** @abstract */
class EvaporationState extends GameMechanicState {
  constructor() {
    super({});
  }

  get data() {
    return new NotImplementedError();
  }

  get currency() {
    return new NotImplementedError();
  }

  get effectValue() {
    return new NotImplementedError();
  }

  get isCustomEffect() {
    return true;
  }

  get canBeApplied() {
    return Entropy.isUnlocked;
  }

  toggle() {
    if (this.data.isActive) {
      this.stop();
      return;
    }
    this.start();
  }

  start() {
    this.data.isActive = true;
  }

  stop() {
    this.data.isActive = false;
    this.data.amount = this.data.amount.max(this.data.gain);
    this.data.time = 0;
    this.data.gain = DC.D0;
  }

  tick(diff) {
    if (!this.data.isActive) return;
    this.data.time += diff;
    this.data.gain = this.data.gain.add(this.gainRate.times(diff));
    if (this.currency.gt(DC.D1)) {
      const pow = 1 - diff * Math.pow(this.data.time, 2 / 3);
      if (pow > 0) {
        this.currency.value = this.currency.value.pow(pow).sub(1).clampMin(DC.D1);
        return;
      }
      this.currency.value = DC.D1;
    }
    this.stop();
  }

  get gainRate() {
    const pow = DC.D1;
    return Decimal.pow(this.data.time + 1, pow).timesEffectOf(EntropyRewards.evaporation);
  }
}

export const EntropyRewards = mapGameDataToObject(
  GameDatabase.quantum.entropyRewards,
  config => new EntropyRewardState(config)
);

export const Entropy = {
  get isUnlocked() {
    return player.unlocks.entropy;
  },

  rewards: EntropyRewards.all,

  tick(diff) {
    if (!this.isUnlocked) {
      checkEntropy();
      return;
    }
    this.enthalpy.tick(diff);
    this.hawkingRadiation.tick(diff);
    Currency.entropy.tick(diff);
    for (const reward of this.rewards) {
      reward.updateAmount();
    }
  },

  get cap() {
    return this.hawkingRadiation.effectValue;
  },

  get gain() {
    let gain = this.enthalpy.effectValue;
    gain = gain.timesEffectOf(EntropyRewards.condenser);
    return gain;
  },

  enthalpy: new class extends EvaporationState {
    get currency() {
      return Currency.frequency;
    }

    get data() {
      return player.quantum.entropy.enthalpy;
    }

    get effectValue() {
      return this.data.amount.div(DC.D2);
    }
  }(),

  hawkingRadiation: new class extends EvaporationState {
    get currency() {
      return Currency.blackHole;
    }

    get data() {
      return player.quantum.entropy.hawkingRadiation;
    }

    get effectValue() {
      return this.data.amount.pow(DC.D2).mul(DC.E1);
    }
  }()
};