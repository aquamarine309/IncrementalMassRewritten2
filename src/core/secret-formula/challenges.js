import { DC } from "@/core/constants";
import { uni } from "@/core/math";

const challengeType = {
  DARK_MATTER: {
    resetKey: "enter_challenge_reset_dark_matter",
    titleKey: "dark_matter_challenges",
    reset: () => Resets.darkMatter.resetLayer(true),
    currency: () => Currency.mass.value,
    formatGoal: value => formatMass(value)
  },
  ATOM: {
    resetKey: "enter_challenge_reset_atom",
    titleKey: "atom_challenges",
    reset: () => Resets.atom.resetLayer(true),
    currency: () => Currency.blackHole.value,
    formatGoal: value => i18n.t("X_black_hole", { value: formatMass(value) })
  },
  SUPERNOVA: {
    resetKey: "enter_challenge_reset_supernova",
    titleKey: "supernova_challenges",
    reset: () => Resets.supernova.resetLayer(true, true),
    currency: () => Currency.mass.value,
    formatGoal: value => formatMass(value)
  },
  // The item below is not necessary to translate now
  DARKNESS: {
    name: "a darkness",
    title: "Darkness"
  },
  FSS: {
    name: "an FSS",
    title: "FSS"
  },
  INFINITY: {
    name: "an Infinity",
    title: "Infinity"
  }
};

export const challenges = [
  {
    id: 1,
    isUnlocked: () => true,
    description: () => i18n.t("challenge_1_description", { value1: formatInt(25), value2: formatInt(50) }),
    max: () => DC.E2.plusEffectOf(Challenge(7).reward),
    baseGoal: DC.D1_5E58,
    goalPow: DC.D1_3,
    goalMult: DC.D5,
    reward: {
      description: () => i18n.t("challenge_1_reward_description"),
      effects: {
        rank: value => Softcap.mult(value, 20, 0.25).floor(),
        tickspeed: value => DC.D0_96.pow(value.sqrt())
      },
      formatEffect: effects => i18n.t("challenge_1_reward_effect", {
        rank: format(effects.rank, 0),
        tickspeed: formatPercents(DC.D1.minus(effects.tickspeed))
      })
    },
    type: challengeType.DARK_MATTER
  },
  {
    id: 2,
    isUnlocked: () => Challenge(1).completions.gte(1) || PlayerProgress.atomUnlocked(),
    description: () => i18n.t("challenge_2_description"),
    max: () => DC.E2.plusEffectOf(Challenge(7).reward),
    baseGoal: DC.D1_989E40,
    goalPow: DC.D1_3,
    goalMult: DC.E1,
    reward: {
      description: () => i18n.t("challenge_2_reward_description", { value: formatPercents(0.075, 1) }),
      effect: value => {
        const effect = value.times(0.075);
        if (GameElement(39).canBeApplied) return effect;
        return Softcap.power(effect.add(1), 1.3, DC.D0_5.powEffectOf(GameElement(8))).minus(1);
      },
      formatEffect: value => `+${formatPercents(value)}`,
      softcapped: value => !GameElement(39).canBeApplied && value.gte(0.3)
    },
    type: challengeType.DARK_MATTER
  },
  {
    id: 3,
    isUnlocked: () => Challenge(2).completions.gte(1) || PlayerProgress.atomUnlocked(),
    description: () => i18n.t("challenge_3_description", { value: formatInt(150) }),
    effect: DC.E150,
    max: () => DC.E2.plusEffectOf(Challenge(7).reward),
    baseGoal: DC.D2_9835E49,
    goalPow: () => DC.D1_25.timesEffectOf(GameElement(10)),
    goalMult: DC.D25,
    reward: {
      description: () => i18n.t("challenge_3_reward_description"),
      effect: value => overflow(Softcap.power(
        value.timesEffectOf(GameElement(64))
          .pow(DC.C2D3).times(0.01).add(1), 3, 0.25
      ), DC.E12, DC.D0_5),
      formatEffect: value => formatPow(value),
      softcapped: value => value.gte(3),
      effectCondition: () => (!Challenge(3).isRunning ||
       Challenge(10).isRunning ||
       FermionType.quarks.fermions.strange.isActive
      )
    },
    type: challengeType.DARK_MATTER
  },
  {
    id: 4,
    isUnlocked: () => Challenge(3).completions.gte(1) || PlayerProgress.atomUnlocked(),
    description: () => i18n.t("challenge_4_description", { value1: formatInt(10), value2: formatInt(100) }),
    effect: DC.E100,
    max: () => DC.E2.plusEffectOf(Challenge(7).reward),
    baseGoal: DC.D1_736881338559743E133,
    goalPow: () => DC.D1_25.timesEffectOf(GameElement(10)),
    goalMult: DC.D30,
    reward: {
      description: () => i18n.t("challenge_4_reward_description"),
      effect: value => overflow(Softcap.power(
        value.timesEffectOf(GameElement(64))
          .pow(DC.C2D3).times(0.01).add(1), 3, 0.25
      ), DC.E12, DC.D0_5),
      formatEffect: value => formatPow(value),
      softcapped: value => value.gte(3)
    },
    type: challengeType.DARK_MATTER
  },
  {
    id: 5,
    isUnlocked: () => PlayerProgress.atomUnlocked(),
    description: () => i18n.t("challenge_5_description"),
    max: () => DC.D50.plusEffectsOf(
      GameElement(13),
      GameElement(73)
    ),
    baseGoal: DC.D1_5E136,
    goalPow: DC.D1_25,
    goalMult: DC.D50,
    noReset: () => false,
    reward: {
      description: () => i18n.t("challenge_5_reward_description"),
      effect: value => DC.D0_97.pow(Softcap.power(value.sqrt(), DC.D5, DC.D0_5)),
      softcapped: value => value.lte(DC.D0_97.pow(DC.D5)),
      formatEffect: value => i18n.t("X_weaker", { value: formatPercents(DC.D1.minus(value)) })
    },
    type: challengeType.ATOM
  },
  {
    id: 6,
    isUnlocked: () => PlayerProgress.supernovaUnlocked() || PlayerProgress.atomUnlocked() && Challenge(5).completions.gt(0),
    description: () => i18n.t("challenge_6_description"),
    max: () => DC.D50.plusEffectsOf(
      GameElement(13),
      GameElement(73)
    ),
    goalPow: DC.D1_25,
    goalMult: DC.D64,
    baseGoal: DC.D1_989E38,
    reward: {
      description: () => i18n.t("challenge_6_reward_description", { value: formatPercents(0.1, 0) }),
      effect: value => {
        const effect = value.times(0.1);
        if (GameElement(39).canBeApplied) return effect;
        return Softcap.power(effect.add(1), DC.D1_5, DC.D0_5).minus(1);
      },
      softcapped: value => !GameElement(39).canBeApplied && value.gte(DC.D0_5),
      formatEffect: value => `+${format(value)}x`
    },
    type: challengeType.ATOM
  },
  {
    id: 7,
    isUnlocked: () => PlayerProgress.supernovaUnlocked() || PlayerProgress.atomUnlocked() && Challenge(6).completions.gt(0),
    description: () => i18n.t("challenge_7_description"),
    effect: DC.D6,
    max: () => DC.D50.plusEffectsOf(
      GameElement(20),
      GameElement(41),
      NeutronUpgrade.chal1,
      GameElement(60),
      GameElement(65),
      GameElement(70)
    ),
    goalPow: DC.D1_25,
    goalMult: DC.D64,
    baseGoal: DC.D1_25E76,
    reward: {
      description: () => i18n.t("challenge_7_reward_description", { value: formatInt(2) }),
      effect: value => value.times(2).timesEffectOf(GameElement(5)),
      formatEffect: value => formatPlus(value, 0)
    },
    milestones: [
      {
        id: 0,
        requirement: DC.D16,
        description: () => i18n.t("challenge_7_milestone_0_description")
      }
    ],
    type: challengeType.ATOM
  },
  {
    id: 8,
    isUnlocked: () => PlayerProgress.supernovaUnlocked() || PlayerProgress.atomUnlocked() && Challenge(7).completions.gt(0),
    description: () => i18n.t("challenge_8_description", { value: formatInt(8) }),
    effect: 0.125,
    max: () => DC.D50.plusEffectsOf(
      GameElement(33),
      NeutronUpgrade.chal1,
      GameElement(56),
      GameElement(65),
      GameElement(70),
      GameElement(73)
    ),
    goalPow: DC.D1_3,
    goalMult: DC.D80,
    baseGoal: DC.D1_989E38,
    reward: {
      description: () => i18n.t("challenge_8_reward_description"),
      effect: value => overflow(Softcap.power(
        value.timesEffectOf(GameElement(64))
          .pow(4 / 7).times(0.02).add(1), DC.D2_3, DC.D0_25
      ), DC.E10, DC.D0_5),
      formatEffect: value => formatPow(value),
      softcapped: value => value.gte(DC.D2_3)
    },
    milestones: [
      {
        id: 0,
        requirement: DC.D1,
        description: () => i18n.t("challenge_8_milestone_0_description")
      }
    ],
    type: challengeType.ATOM
  },
  {
    id: 9,
    isUnlocked: () => NeutronUpgrade.chal4.isBought,
    description: () => i18n.t("challenge_9_description", { value: format(0.9, 1) }),
    effect: DC.D0_9,
    max: () => DC.E2.plusEffectOf(NeutronUpgrade.chal4b),
    goalPow: DC.D2,
    goalMult: DC.E500,
    baseGoal: DC.D1_5E99056,
    reward: {
      description: () => i18n.t("challenge_9_reward_description"),
      effect: value => {
        let pow = value.pow(NeutronUpgrade.chal4a.effectOrDefault(DC.D0_25)).times(DC.D0_1).add(DC.D1);
        pow = Softcap.power(pow, DC.D21, DC.D0_25);
        pow = overflow(pow, DC.D5E8, DC.D0_5);
        pow = overflow(pow, DC.E12, DC.D0_15);
        return pow;
      },
      formatEffect: value => formatPow(value),
      softcapped: value => value.gte(DC.D21)
    },
    type: challengeType.SUPERNOVA
  },
  {
    id: 10,
    isUnlocked: () => NeutronUpgrade.chal5.isBought,
    description: () => i18n.t("challenge_10_description"),
    max: () => DC.E2,
    goalPow: DC.D2,
    goalMult: DC.E2000,
    baseGoal: DC.D1_5E30056,
    reward: {
      description: () => i18n.t("challenge_10_reward_description"),
      effect: value => value.pow(DC.C4D7).times(DC.D0_01).add(1),
      formatEffect: value => formatX(value),
      effectCondition: () => !Challenge(10).canBeApplied
    },
    milestones: [
      {
        id: 0,
        requirement: DC.D1,
        description: () => i18n.t("challenge_10_milestone_0_description")
      }
    ],
    type: challengeType.SUPERNOVA
  },
  {
    id: 11,
    isUnlocked: () => NeutronUpgrade.chal6.isBought,
    description: () => i18n.t("challenge_11_description"),
    max: () => DC.E2,
    goalPow: DC.D2,
    goalMult: DC.EE6,
    baseGoal: DC.D1_5E38000056,
    reward: {
      description: () => i18n.t("challenge_11_reward_description"),
      effect: value => value.sqrt().div(10).add(1),
      formatEffect: value => formatX(value)
    },
    type: challengeType.SUPERNOVA
  },
  {
    id: 12,
    isUnlocked: () => NeutronUpgrade.chal7.isBought,
    description: () => i18n.t("challenge_12_description"),
    max: () => DC.E2,
    goalPow: DC.D2,
    goalMult: DC.E2E7,
    baseGoal: uni(DC.E8_4E8),
    reward: {
      description: () => i18n.t("challenge_12_reward_description"),
      effect: value => {
        let effect = value.pow(NeutronUpgrade.chal7a.effectOrDefault(DC.D0_5));
        effect = Softcap.power(effect, DC.D50, DC.D0_5);
        effect = overflow(effect, DC.E68, DC.D0_5);
        effect = overflow(effect, DC.E90, DC.D0_15);
        return effect;
      },
      formatEffect: value => formatPlus(value)
    },
    milestones: [
      {
        id: 0,
        requirement: DC.D1,
        description: () => i18n.t("challenge_12_milestone_0_description")
      }
    ],
    type: challengeType.SUPERNOVA
  }
];