import { DC } from "@/core/constants";

export const rage = [
  {
    id: 0,
    description: () => i18n.t("rage_upgrade_0_description"),
    cost: DC.D1,
    effect: () => MassUpgrade.booster.totalAmount,
    formatEffect: value => i18n.t("rage_upgrade_0_effect", { value: format(value, 0) }),
  },
  {
    id: 1,
    description: () => i18n.t("rage_upgrade_1_description"),
    cost: DC.E1,
    effect: () => MassUpgrade.stronger.totalAmount,
    formatEffect: value => i18n.t("rage_upgrade_1_effect", { value: format(value, 0) })
  },
  {
    id: 2,
    description: () => i18n.t("rage_upgrade_2_description"),
    cost: DC.D25
  },
  {
    id: 3,
    description: () => i18n.t("rage_upgrade_3_description"),
    cost: DC.D50
  },
  {
    id: 4,
    description: () => i18n.t("rage_upgrade_4_description"),
    cost: DC.E4
  },
  {
    id: 5,
    description: () => i18n.t("rage_upgrade_5_description"),
    cost: DC.E5
  },
  {
    id: 6,
    description: () => i18n.t("rage_upgrade_6_description"),
    cost: DC.E7,
    effect: () => MassUpgrade.tickspeed.boughtAmount.div(3).plusEffectOf(GameElement(38)),
    formatEffect: value => i18n.t("rage_upgrade_6_effect", { value: format(value, 0) })
  },
  {
    id: 7,
    description: () => i18n.t("rage_upgrade_7_description"),
    cost: DC.E15,
    effect: () => {
      let exp = Currency.ragePowers.value.clampMin(1).log10().clampMin(1).log10().pow(1.25);
      exp = Softcap.power(exp, DC.D2_5, DC.D0_5);
      return DC.D0_9.pow(exp);
    },
    formatEffect: value => i18n.t("X_weaker", { value: formatPercents(DC.D1.minus(value)) }),
    softcapped: value => value.lte(0.768433471421)
  },
  {
    id: 8,
    description: () => i18n.t("rage_upgrade_8_description", { value: formatPow(0.25, 2) }),
    effect: DC.D0_25,
    cost: DC.E31,
    isUnlocked: () => PlayerProgress.blackHoleUnlocked
  },
  {
    id: 9,
    description: () => i18n.t("rage_upgrade_9_description", { value: formatPercents(0.2, 0) }),
    effect: DC.D0_8,
    cost: DC.E43,
    isUnlocked: () => PlayerProgress.blackHoleUnlocked
  },
  {
    id: 10,
    description: () => i18n.t("rage_upgrade_10_description"),
    cost: DC.E72,
    effect: () => overflow(
      Softcap.dilation(Softcap.power(Currency.ragePowers.value.add(1).pow(0.1),
        DC.E4000, 0.1),
      DC.E1_5E31, DC.D0_95),
      DC.EE185, DC.D0_5
    ),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(DC.E4000),
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    id: 11,
    description: () => i18n.t("rage_upgrade_11_description"),
    cost: DC.E120,
    effect: () => Softcap.power(Currency.ragePowers.value.clampMin(1).log10(), 200, 0.75).div(1000),
    formatEffect: value => `+${formatPow(value)}`,
    softcapped: value => value.gte(0.2),
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 12,
    description: () => i18n.t("rage_upgrade_12_description", { value: formatX(3, 0) }),
    cost: DC.E180,
    effect: () => DC.D3.pow(RankType.rank.amount),
    formatEffect: value => formatX(value),
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 13,
    description: () => i18n.t("rage_upgrade_13_description", { value: formatInt(50) }),
    cost: DC.E320,
    effect: 50,
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 14,
    description: () => i18n.t("rage_upgrade_14_description"),
    cost: DC.E480,
    effect: () => Currency.mass.value.clampMin(1).log10().pow(1.25),
    formatEffect: value => formatX(value),
    isUnlocked: () => PlayerProgress.atomUnlocked()
  }
];