export const awayProgressTypes = [
  {
    name: "mass",
    isUnlocked: () => true
  },
  {
    name: "ragePowers",
    isUnlocked: () => PlayerProgress.rageUnlocked()
  },
  {
    name: "darkMatter",
    isUnlocked: () => PlayerProgress.blackHoleUnlocked()
  },
  {
    name: "blackHole",
    isUnlocked: () => PlayerProgress.blackHoleUnlocked()
  },
  {
    name: "atom",
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    name: "quark",
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    name: "atomicPower",
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    name: "relativisticParticles",
    reference: ["dilation", "particles"],
    isUnlocked: () => MassDilation.isUnlocked
  },
  {
    name: "dilatedMass",
    reference: ["dilation", "mass"],
    isUnlocked: () => MassDilation.isUnlocked
  },
  {
    name: "collapsedStars",
    reference: ["stars", "amount"],
    isUnlocked: () => Stars.isUnlocked
  },
  {
    name: "neutronStars",
    reference: ["supernova", "stars"],
    isUnlocked: () => PlayerProgress.supernovaUnlocked()
  },
  {
    name: "photon",
    reference: ["supernova", "bosons", "photon"],
    isUnlocked: () => Bosons.areUnlocked
  },
  {
    name: "gluon",
    reference: ["supernova", "bosons", "gluon"],
    isUnlocked: () => Bosons.areUnlocked
  },
  {
    name: "uQuark",
    forcedName: "U-Quark",
    reference: ["supernova", "fermions", "quarks"],
    isUnlocked: () => Fermions.areUnlocked
  },
  {
    name: "uLepton",
    forcedName: "U-Lepton",
    reference: ["supernova", "fermions", "leptons"],
    isUnlocked: () => Fermions.areUnlocked
  },
];