import { SetPurchasableMechanicState } from "./game-mechanics";

class GameElementState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.quark;
  }

  get set() {
    return player.elements;
  }

  get isUnlocked() {
    return this.id <= GameElements.maxId;
  }

  reset() {
    this.isBought = false;
  }
}

export const GameElement = GameElementState.createAccessor(GameDatabase.gameElements);

export const GameElements = {
  all: GameElement.index.compact(),

  clearAll() {
    player.elements = new Set();
  },

  get isUnlocked() {
    return PlayerProgress.supernovaUnlocked() || Challenge(7).milestones[0].canBeApplied;
  },

  buyMax() {
    if (player.elements.size >= this.maxId) return;
    for (let i = 1; i <= this.maxId; i++) this.all[i - 1].purchase();
  },

  get maxId() {
    let amount = 0;
    if (PlayerProgress.quantumUnlocked()) {
      amount += 80;
      if (Primordium.isUnlocked) {
        amount += 3;
      }
      if (QuantumChallenges.areUnlocked) {
        amount += 3;
      }
    } else if (PlayerProgress.supernovaUnlocked()) {
      amount += 54;
      if (Bosons.areUnlocked) {
        amount += 3;
      }
      if (Fermions.areUnlocked) {
        amount += 10;
      }
      if (Radiation.isUnlocked) {
        amount += 10;
      }
    } else {
      amount += 4;
      if (Challenge(8).milestones[0].canBeApplied) {
        amount += 14;
      }
      if (GameElement(18).isBought) {
        amount += 3;
      }
      if (GameElement(21).isBought) {
        amount += 15;
      }
      if (GameElement(36).isBought) {
        amount += 18;
      }
    }
    return amount;
  }
};