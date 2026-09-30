export class PlayerProgress {
  static rageUnlocked() {
    return player.unlocks.ragePower;
  }

  static blackHoleUnlocked() {
    return player.unlocks.darkMatter;
  }

  static atomUnlocked() {
    return player.unlocks.atom;
  }

  static supernovaUnlocked() {
    return Currency.supernova.gt(0) || PlayerProgress.quantumUnlocked();
  }

  static quantumUnlocked() {
    return Currency.quantizes.gt(0);
  }
}
