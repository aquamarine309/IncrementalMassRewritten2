import { DC } from "./constants";
import { deepmergeAll } from "@/utility/deepmerge";

window.player = {
  mass: DC.D0,
  ranks: {
    rank: DC.D0,
    tier: DC.D0,
    tetr: DC.D0,
    pent: DC.D0,
    hex: DC.D0
  },
  ragePowers: DC.D0,
  darkMatter: DC.D0,
  blackHole: DC.D0,
  atoms: DC.D0,
  quark: DC.D0,
  atomicPower: DC.D0,
  particles: [DC.D0, DC.D0, DC.D0],
  particleWeights: [1, 1, 1],
  particlePowers: [DC.D0, DC.D0, DC.D0],
  ratioMode: RATIO_MODE.SINGLE,
  elements: new Set(),
  dilation: {
    active: false,
    particles: DC.D0,
    mass: DC.D0,
    upgrades: Array.repeat(DC.D0, 12),
  },
  stars: {
    amount: DC.D0,
    generators: Array.repeat(DC.D0, 5),
    unlocked: -1
  },
  supernova: {
    times: DC.D0,
    stars: DC.D0,
    tree: new Set(),
    bosons: {
      gluon: DC.D0,
      graviton: DC.D0,
      higgsBoson: DC.D0,
      negativeW: DC.D0,
      positiveW: DC.D0,
      zBoson: DC.D0,
      photon: DC.D0
    },
    bosonUpgrades: {
      photon: Array.repeat(DC.D0, 4),
      gluon: Array.repeat(DC.D0, 4)
    },
    fermions: {
      quarks: DC.D0,
      leptons: DC.D0,
      tiers: Array.repeat(DC.D0, 12),
      active: -1
    },
    radiation: {
      frequency: DC.D0,
      unlocks: Array.range(1, 7).map(() => ({
        distance: DC.D0,
        amplitude: DC.D0,
        velocity: DC.D0
      }))
    }
  },
  quantum: {
    foam: DC.D0,
    chromaState: 0,
    chroma: [DC.D0, DC.D0, DC.D0],
    times: DC.D0,
    blueprint: DC.D0,
    primordium: Array.repeat(DC.D0, 8),
    challenges: {
      mods: Array.repeat(0, 8),
      shards: 0,
      isActive: false
    },
    entropy: {
      amount: DC.D0,
      enthalpy: {
        isActive: false,
        amount: DC.D0,
        gain: DC.D0,
        time: 0
      },
      hawkingRadiation: {
        isActive: false,
        amount: DC.D0,
        gain: DC.D0,
        time: 0
      },
      rewards: Array.repeat(DC.D0, 8)
    }
  },
  auto: {
    ranks: {
      rank: false,
      tier: false,
      tetr: false,
      pent: false,
      hex: false
    },
    massUpgrades: {
      muscler: false,
      booster: false,
      stronger: false,
      overpower: false,
      tickspeed: false,
      condenser: false,
      cosmicRay: false,
      starBooster: false,
      cosmicString: false
    },
    mainUpgrades: {
      rage: false,
      blackHole: false,
      atom: false
    },
    dilationUpgrades: false,
    elements: false,
    bosonUpgrades: false,
    radiation: false,
    neutronUpgrade: false,
    quantum: {
      isActive: false,
      type: AUTO_QUANTUM_TYPE.AMOUNT,
      amount: DC.D0,
      time: 0
    }
  },
  massUpgrades: {
    muscler: DC.D0,
    booster: DC.D0,
    stronger: DC.D0,
    overpower: DC.D0,
    tickspeed: DC.D0,
    condenser: DC.D0,
    cosmicRay: DC.D0,
    starBooster: DC.D0,
    cosmicString: DC.D0
  },
  unlocks: {
    ragePower: false,
    darkMatter: false,
    atom: false,
    entropy: false
  },
  checks: {
    supernova: {
      noTick: true,
      noCondenser: true
    }
  },
  time: {
    supernova: 0,
    quantum: 0
  },
  // Bits
  mainUpgrades: {
    rage: 0,
    blackHole: 0,
    atom: 0
  },
  challenges: {
    current: 0,
    completions: Array.repeat(DC.D0, 20),
    page: 0
  },
  records: {
    gameCreatedTime: Date.now(),
    maxMass: DC.D0
  },
  lastUpdate: Date.now(),
  version: 3,
  tutorialBits: 0,
  options: {
    updateRate: 33,
    lastOpenTab: 0,
    hiddenTabBits: 0,
    automaticTabSwitching: false,
    hiddenSubtabBits: Array.repeat(0, 10),
    lastOpenSubtab: Array.repeat(0, 10),
    starBG: true,
    adUI: false,
    darkTheme: true,
    language: "en",
    massDisplay: MASS_DISPLAY.DEFAULT,
    foldUselessRank: true,
    iconifyTab: false,
    confirmations: {
      ragePower: true,
      darkMatter: true,
      atom: true,
      supernova: true,
      quantum: true
    },
    awayProgress: {
      mass: true,
      ragePowers: true,
      darkMatter: true,
      blackHole: true,
      atom: true,
      quark: true,
      atomicPower: true,
      relativisticParticles: true,
      dilatedMass: true,
      collapsedStars: true,
      neutronStars: true,
      photon: true,
      gluon: true,
      uQuark: true,
      uLepton: true
    }
  }
};

export const Player = {
  defaultStart: deepmergeAll([{}, player])
};