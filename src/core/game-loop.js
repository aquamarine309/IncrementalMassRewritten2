import { DEV } from "@/env";

export const GameLoop = {
  interval: null,

  devSpeed: 1,

  get updateRate() {
    return player.options.updateRate;
  },

  set updateRate(value) {
    player.options.updateRate = value;
    this.restart();
  },

  start() {
    if (this.interval !== null) {
      throw new Error("GameLoop has already started.");
    }
    this.interval = setInterval(() => this.tick(), this.updateRate);
  },

  stop() {
    if (this.interval === null) return;
    clearInterval(this.interval);
    this.interval = null;
  },

  restart() {
    this.stop();
    this.start();
  },

  tick(ms) {
    let diff = ms ?? Date.now() - player.lastUpdate;
    player.lastUpdate += diff;

    const realDiff = diff;
    if (DEV) {
      diff *= this.devSpeed;
    }

    const seconds = diff / 1000;

    const preQuantumTime = Quantum.speed.times(seconds);

    Currency.mass.tick(preQuantumTime);

    if (PlayerProgress.blackHoleUnlocked() && !Entropy.hawkingRadiation.data.isActive) {
      Currency.blackHole.tick(preQuantumTime);
    }

    if (PlayerProgress.atomUnlocked()) {
      Currency.atomicPower.tick(preQuantumTime);
      Atom.tick(preQuantumTime);
    }

    if (MassDilation.isUnlocked) {
      Currency.dilatedMass.tick(preQuantumTime);
    }

    if (Stars.isUnlocked) {
      StarGenerators.tick(preQuantumTime);
    }

    if (PlayerProgress.supernovaUnlocked()) {
      Currency.neutronStars.tick(preQuantumTime);
      Supernova.startingAutoCheck();
      Bosons.tick(preQuantumTime);
      Fermions.update(preQuantumTime);
      Radiation.tick(preQuantumTime);
    }

    if (PlayerProgress.quantumUnlocked()) {
      Currency.blueprint.tick(seconds);
      for (const chroma of Chroma) {
        chroma.tick(seconds);
      }
      Entropy.tick(seconds);
    }

    if (NeutronUpgrade.qol3.canBeApplied) {
      Currency.relativisticParticles.tick(preQuantumTime);
    }

    if (NeutronUpgrade.quQol4.canBeApplied) {
      Resets.supernova.resetLayer();
    }

    Challenges.applyAutoBulk();

    applyAutoprestige(preQuantumTime);

    updateTime(realDiff);

    Autobuyers.tick();

    GameUI.update();
    EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  }
};