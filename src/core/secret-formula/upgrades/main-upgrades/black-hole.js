import { DC } from "@/core/constants";

export const blackHole = [
  {
    id: 0,
    description: () => i18n.t("black_hole_upgrade_0_description"),
    cost: DC.D1
  },
  {
    id: 1,
    description: () => i18n.t("black_hole_upgrade_1_description"),
    effect: () => MassUpgrade.tickspeed.boughtAmount.add(1).root(8),
    formatEffect: value => formatX(value),
    cost: DC.E1
  },
  {
    id: 2,
    description: () => i18n.t("black_hole_upgrade_2_description"),
    effect: () => Softcap.power(
      Currency.blackHole.value.max(1).log10().pow(1.5),
      DC.E2, DC.C1D3
    ).floor(),
    formatEffect: value => i18n.t("X_later", { value: format(value, 0) }),
    softcapped: value => value.gte(DC.E2),
    cap: DC.D400,
    cost: DC.E2
  },
  {
    id: 3,
    description: () => i18n.t("black_hole_upgrade_3_description"),
    cost: DC.E4
  },
  {
    id: 4,
    description: () => i18n.t("black_hole_upgrade_4_description"),
    cost: DC.D5E5
  },
  {
    id: 5,
    description: () => i18n.t("black_hole_upgrade_5_description", { value: formatPercents(1, 0) }),
    effect: () => Currency.blackHole.value.clampMin(1).log10().add(1).pow(2),
    formatEffect: value => formatX(value),
    cost: DC.D2E6
  },
  {
    id: 6,
    description: () => i18n.t("black_hole_upgrade_6_description"),
    effect: () => BlackHole.mass.add(1).root(3),
    formatEffect: value => i18n.t("X_later", { value: formatX(value) }),
    cost: DC.E13,
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 7,
    description: () => i18n.t("black_hole_upgrade_7_description", { value: format(1.15, 2) }),
    effect: 1.15,
    cost: DC.E17,
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 8,
    description: () => i18n.t("black_hole_upgrade_8_description"),
    effect: () => Currency.darkMatter.value.clampMin(1).log10().sqrt(),
    formatEffect: value => i18n.t("X_later", { value: format(value) }),
    cost: DC.E27,
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 9,
    description: () => i18n.t("black_hole_upgrade_9_description"),
    effect: () => DC.D2.pow(Softcap.power(Currency.darkMatter.value.add(1).log10(), 11600, 0.5)),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(11600),
    cost: DC.E33,
    isUnlocked: () => Challenges.isUnlocked
  },
  {
    id: 10,
    description: () => i18n.t("black_hole_upgrade_10_description", { value: formatPercents(0.1, 0) }),
    effect: 0.9,
    cost: DC.E80,
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    id: 11,
    description: () => i18n.t("black_hole_upgrade_11_description", { value: formatPercents(0.15, 0) }),
    effect: 0.85,
    cost: DC.E120,
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    id: 12,
    description: () => i18n.t("black_hole_upgrade_12_description", { value: formatInt(10) }),
    effect: 10,
    cost: DC.E180,
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    id: 13,
    description: () => i18n.t("black_hole_upgrade_13_description"),
    effect: () => Particles.neutron.power.add(1).pow(2),
    formatEffect: value => formatX(value),
    cost: DC.E210,
    isUnlocked: () => PlayerProgress.atomUnlocked()
  },
  {
    id: 14,
    description: () => i18n.t("black_hole_upgrade_14_description"),
    effect: () => Softcap.power(Softcap.power(
      Currency.atomicPower.value.add(1).log(5), DC.D2E9, DC.D0_25),
    DC.E10, DC.D0_1
    ).floor(),
    formatEffect: value => formatPlus(value, 0),
    softcapped: value => value.gte(DC.D2E9),
    cost: DC.E420,
    isUnlocked: () => PlayerProgress.atomUnlocked()
  }
];