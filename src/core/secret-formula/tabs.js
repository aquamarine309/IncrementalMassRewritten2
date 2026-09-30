import { ICONS } from "./svg-icons";

export const tabs = [
  {
    id: 0,
    key: "main",
    symbol: ICONS.mass,
    subtabs: [
      {
        id: 0,
        key: "mass",
        symbol: ICONS.mass,
        component: "MassTab"
      },
      {
        id: 1,
        key: "black_hole",
        symbol: ICONS.blackHole,
        component: "BlackHoleTab",
        condition: () => PlayerProgress.blackHoleUnlocked()
      },
      {
        id: 2,
        key: "atomic_generator",
        symbol: "<i class='fas fa-atom'></i>",
        component: "AtomicGeneratorTab",
        condition: () => PlayerProgress.atomUnlocked()
      },
      {
        id: 3,
        key: "stars",
        symbol: "<i class='fas fa-star'></i>",
        component: "StarsTab",
        condition: () => Stars.isUnlocked
      },
      {
        id: 4,
        key: "indescribable_matter",
        symbol: ICONS.blueprint,
        component: "IndescribableMatterTab",
        condition: () => PlayerProgress.quantumUnlocked()
      }
    ]
  },
  {
    id: 1,
    key: "statistics",
    condition: () => (RankType.rank.amount.gt(0) ||
      RankType.tier.amount.gt(0) ||
      PlayerProgress.rageUnlocked()
    ),
    symbol: "<i class='fas fa-line-chart'></i>",
    subtabs: [
      {
        id: 0,
        key: "rank_rewards",
        symbol: "<i class='fas fa-trophy'></i>",
        component: "RankRewardsTab"
      },
      {
        id: 1,
        key: "scaling",
        symbol: "<i class='fas fa-balance-scale'></i>",
        component: "ScalingTab"
      }
    ]
  },
  {
    id: 2,
    key: "options",
    symbol: "<i class='fas fa-cog'></i>",
    subtabs: [
      {
        id: 0,
        key: "options",
        symbol: "<i class='fas fa-cog'></i>",
        component: "OptionsTab"
      }
    ]
  },
  {
    id: 3,
    key: "upgrades",
    symbol: "<i class='fas fa-arrow-up'></i>",
    condition: () => PlayerProgress.rageUnlocked(),
    subtabs: [
      {
        id: 0,
        key: "rage",
        symbol: "<i class='fas fa-bolt'></i>",
        component: "RageUpgradesTab"
      },
      {
        id: 1,
        key: "black_hole",
        symbol: ICONS.blackHole,
        component: "BHUpgradesTab",
        condition: () => PlayerProgress.blackHoleUnlocked()
      },
      {
        id: 2,
        key: "atom",
        symbol: "<i class='fas fa-atom'></i>",
        component: "AtomUpgradesTab",
        condition: () => PlayerProgress.atomUnlocked()
      },
    ]
  },
  {
    id: 4,
    key: "challenges",
    symbol: "<i class='fas fa-mountain'></i>",
    condition: () => Challenges.isUnlocked,
    subtabs: [
      {
        id: 0,
        key: "challenges",
        symbol: "<i class='fas fa-mountain'></i>",
        component: "ChallengesTab"
      },
      {
        id: 1,
        key: "quantum",
        symbol: ICONS.quantum,
        component: "QuantumChallengesTab",
        condition: () => QuantumChallenges.areUnlocked
      }
    ]
  },
  {
    id: 5,
    key: "atom",
    symbol: "<i class='fas fa-atom'></i>",
    condition: () => PlayerProgress.atomUnlocked(),
    subtabs: [
      {
        id: 0,
        key: "particles",
        symbol: "<i class='fas fa-sitemap'></i>",
        component: "ParticlesTab"
      },
      {
        id: 1,
        key: "elements",
        symbol: ICONS.element,
        component: "ElementsTab",
        condition: () => GameElements.isUnlocked
      },
      {
        id: 2,
        key: "dilation",
        component: "MassDilationTab",
        symbol: "ψ",
        condition: () => MassDilation.isUnlocked
      }
    ]
  },
  {
    id: 6,
    key: "supernova",
    symbol: ICONS.supernova,
    color: "var(--color-supernova)",
    condition: () => PlayerProgress.supernovaUnlocked(),
    subtabs: [
      {
        id: 0,
        key: "neutron_tree",
        symbol: "<i class='fas fa-tree'></i>",
        component: "NeutronTreeTab"
      },
      {
        id: 1,
        key: "bosons",
        symbol: ICONS.bosons,
        component: "BosonsTab",
        condition: () => Bosons.areUnlocked
      },
      {
        id: 2,
        key: "fermions",
        symbol: "<i class='fas fa-braille'></i>",
        component: "FermionsTab",
        condition: () => Fermions.areUnlocked
      },
      {
        id: 3,
        key: "radiation",
        symbol: "<i class='fas fa-podcast'></i>",
        component: "RadiationTab",
        condition: () => Radiation.isUnlocked || PlayerProgress.quantumUnlocked()
      }
    ]
  },
  {
    id: 7,
    key: "quantum",
    symbol: ICONS.quantum,
    color: "var(--color-quantum)",
    condition: () => PlayerProgress.quantumUnlocked(),
    subtabs: [
      {
        id: 0,
        key: "chroma",
        symbol: ICONS.chroma,
        component: "ChromaTab"
      },
      {
        id: 1,
        key: "milestones",
        symbol: ICONS.milestone,
        component: "QuantumMilestonesTab"
      },
      {
        id: 2,
        key: "auto_quantum",
        symbol: "<i class='fas fa-cog'></i>",
        condition: () => QuantumMilestones.quantizesBoostStars.canBeApplied,
        component: "AutoQuantumTab"
      },
      {
        id: 3,
        key: "primordium",
        symbol: ICONS.primordium,
        condition: () => Primordium.isUnlocked,
        component: "PrimordiumTab"
      },
      {
        id: 4,
        key: "entropy",
        symbol: ICONS.entropy,
        condition: () => Entropy.isUnlocked,
        component: "EntropyTab"
      }
    ]
  }
];