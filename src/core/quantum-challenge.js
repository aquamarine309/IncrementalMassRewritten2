import { GameMechanicState } from "./game-mechanics";
import { DC } from "./constants";

class QuantumChallengeState extends GameMechanicState {
  constructor(config) {
    const configCopy = { ...config };
    if (config.effects) {
      for (const key in config.effects) {
        const effect = config.effects[key];
        configCopy.effects[key] = () => effect(this.mod);
      }
    } else if (config.effect) {
      const effect = config.effect;
      configCopy.effect = () => effect(this.mod);
    }
    const description = config.description;
    configCopy.description = () => {
      if (this.effects) {
        const effects = {};
        for (const key in this.effects) {
          effects[key] = this.effects[key].effectValue;
        }
        return description(effects);
      }
      return description(this.effectValue);
    };
    super(configCopy);
  }

  get isEffectActive() {
    return QuantumChallenges.isActive;
  }

  get mod() {
    return QuantumChallenges.mods[this.id];
  }

  set mod(value) {
    if (QuantumChallenges.isActive) return;
    QuantumChallenges.mods[this.id] = Math.min(value, QuantumChallenges.maxMod);
    QuantumChallenges.pendingShards.invalidate();
  }

  get name() {
    return i18n.t(`quantum_challenge_${this.id}_name`);
  }
}

export const QuantumChallenge = QuantumChallengeState.createAccessor(
  GameDatabase.quantum.challenges
);

export const QuantumChallenges = {
  all: QuantumChallenge.index.compact(),

  pendingShards: new Lazy(() => {
    let shards = 0;
    const qc2 = NeutronUpgrade.qc2.canBeApplied;
    for (const qc of QuantumChallenges.all) {
      const mod = qc.mod;
      shards += mod;
      if (qc2 && mod >= 10) {
        shards++;
      }
    }
    return shards;
  }),

  get areUnlocked() {
    return NeutronUpgrade.unl3.canBeApplied;
  },

  get isActive() {
    return player.quantum.challenges.isActive;
  },

  set isActive(value) {
    player.quantum.challenges.isActive = value;
  },

  get shards() {
    return player.quantum.challenges.shards;
  },

  set shards(value) {
    player.quantum.challenges.shards = value;
  },

  get mods() {
    return player.quantum.challenges.mods;
  },

  start() {
    if (this.isActive || this.pendingShards.value <= 0) return;
    Resets.quantum.resetLayer(true, true);
    this.isActive = true;
    if (NeutronUpgrade.quQol9.canBeApplied) {
      GameElement(84).isBought = true;
    }
  },

  exit() {
    if (!this.isActive) return;
    Resets.quantum.resetLayer(true, true);
    this.isActive = false;
  },

  toggle() {
    if (this.isActive) {
      this.exit();
      return;
    }
    this.start();
  },

  get maxMod() {
    return 10;
  },

  get base() {
    return DC.D2.plusEffectOf(NeutronUpgrade.qf4);
  },

  get effect() {
    return this.base.pow(this.shards);
  }
};