import { DC } from "@/core/constants";

export const atom = [
  {
    id: 0,
    description: () => i18n.t("atom_upgrade_0_description"),
    cost: DC.D1
  },
  {
    id: 1,
    description: () => i18n.t("atom_upgrade_1_description"),
    cost: DC.E2
  },
  {
    id: 2,
    description: () => i18n.t("atom_upgrade_2_description"),
    cost: DC.D2_5E4
  },
  {
    id: 3,
    description: () => i18n.t("atom_upgrade_3_description"),
    cost: DC.E10,
    effect: () => MassUpgrade.condenser.boughtAmount.pow(0.8).times(0.01),
    formatEffect: value => `+${format(value)}x`
  },
  {
    id: 4,
    description: () => i18n.t("atom_upgrade_4_description", { value: formatInt(10) }),
    cost: DC.E16,
    effect: DC.E1
  },
  {
    id: 5,
    description: () => i18n.t("atom_upgrade_5_description", { value: formatPercents(1, 0) }),
    cost: DC.E18,
    effect: () => Currency.atomicPower.value.add(1).sqrt(),
    formatEffect: value => i18n.t("X_later", { value: formatX(value) })
  },
  {
    id: 6,
    description: () => i18n.t("atom_upgrade_6_description"),
    effect: () => DC.D1_025.pow(MassUpgrade.tickspeed.boughtAmount),
    formatEffect: value => formatX(value),
    cost: DC.E25
  },
  {
    id: 7,
    description: () => i18n.t("atom_upgrade_7_description"),
    effect: () => Currency.atomicPower.value.clampMin(1).log10().add(1),
    formatEffect: value => formatX(value),
    cost: DC.E35
  },
  {
    id: 8,
    description: () => i18n.t("atom_upgrade_8_description", { value: formatPercents(0.15, 0) }),
    effect: 1.15,
    cost: DC.D2E44
  },
  {
    id: 9,
    description: () => i18n.t("atom_upgrade_9_description"),
    effect: () => RankType.tier.amount.times(2).floor(),
    formatEffect: value => i18n.t("X_later", { value: `+${format(value, 0)}` }),
    cost: DC.D5E47
  },
  {
    id: 10,
    description: () => i18n.t("atom_upgrade_10_description"),
    effect: () => Currency.dilatedMass.value.max(1).log10().add(1).pow(0.1),
    formatEffect: value => formatX(value),
    cost: DC.E1640
  },
  {
    id: 11,
    description: () => i18n.t("atom_upgrade_11_description"),
    effect: DC.D1_25,
    cost: DC.E2015
  }
];