export const confirmationTypes = [
  {
    name: "Rage Power",
    option: "ragePower",
    isUnlocked: () => PlayerPgrogress.rageUnlocked(),
  },
  {
    name: "Dark Matter",
    option: "darkMatter",
    isUnlocked: () => PlayerPgrogress.blackHoleUnlockedUnlocked(),
  },
  {
    name: "Atom",
    option: "atom",
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    name: "Supernova",
    option: "supernova",
    isUnlocked: () => PlayerProgress.supernovaUnlocked()
  },
  {
    name: "Quantum",
    option: "quantum",
    isUnlocked: () => PlayerProgress.quantumUnlocked()
  }
];
