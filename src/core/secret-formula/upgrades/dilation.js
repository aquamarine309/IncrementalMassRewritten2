import { DC } from "@/core/constants";

export const dilation = {
  doubleMass: {
    id: 0,
    description: () => i18n.t(GameElement(25).canBeApplied ? "dilation_upgrade_0_description_triple" : "dilation_upgrade_0_description_double"),
    cost: value => DC.E1.pow(value.add(1)),
    bulk: value => value.log10().floor(),
    effect: value => Softcap.dilation(DC.D2.plusEffectOf(GameElement(25)).pow(value.timesEffectOf(DilationUpgrade.first3Better)), DC.E1_2E4, DC.D0_96),
    formatEffect: value => formatX(value, 0),
    softcapped: value => value.gte(DC.E1_2E4)
  },
  massStronger: {
    id: 1,
    description: () => i18n.t("dilation_upgrade_1_description"),
    cost: value => DC.E1.pow(value.add(2)),
    bulk: value => value.log10().minus(1).floor(),
    effect: value => {
      if (GameElement(83).canBeApplied) return dilatedValue(value, DC.D2, DC.D1_5).add(1);
      if (DilationUpgrade.du2Better.canBeApplied) return value.timesEffectOf(DilationUpgrade.first3Better).pow(DC.C2D3).times(0.25).add(1);
      return value.timesEffectOf(DilationUpgrade.first3Better).sqrt().times(0.15).add(1);
    },
    formatEffect: value => i18n.t("X_stronger", { value: formatPercents(value.minus(1)) })
  },
  doubleParticle: {
    id: 2,
    description: () => i18n.t("dilation_upgrade_2_description"),
    cost: value => DC.E1.pow(value.pow(DC.D1_25.powEffectOf(DilationUpgrade.du3Weaker)).add(3)),
    bulk: value => value.log10().minus(3).root(DC.D1_25.powEffectOf(DilationUpgrade.du3Weaker)).add(1).floor(),
    effect: value => Softcap.power(DC.D2.pow(Softcap.power(value.timesEffectOf(DilationUpgrade.first3Better), DC.D2_5E26, DC.D0_1)), DC.E25, DC.D0_75),
    softcapped: value => value.gte(DC.E25),
    formatEffect: value => formatX(value, 0)
  },
  strongerPower: {
    id: 3,
    description: () => i18n.t("dilation_upgrade_3_description"),
    cost: () => DC.D4_0475E21,
    bulk: value => (value.gte(DC.D4_0475E21) ? DC.D1 : DC.D0),
    max: DC.D1,
    effect: () => Currency.dilatedMass.value.max(1).log10().div(2).cbrt().div(8).add(1),
    formatEffect: value => formatX(value)
  },
  du3Weaker: {
    id: 4,
    description: () => i18n.t("dilation_upgrade_4_description", { value: formatPercents(0.1, 0) }),
    cost: value => DC.E5.pow(value).times(DC.D1_619E24),
    bulk: value => value.div(DC.D1_619E24).log(DC.D5).add(1).floor(),
    max: DC.D5,
    effect: value => DC.D1.minus(value.times(0.1)),
    formatEffect: value => i18n.t("X_weaker", { value: formatPercents(DC.D1.minus(value)) })
  },
  rpFormula: {
    id: 5,
    description: () => i18n.t("dilation_upgrade_5_description"),
    cost: value => DC.E3.pow(value.pow(1.5)).times(DC.D1_5E73),
    bulk: value => value.div(DC.D1_5E73).log10().div(3).pow(DC.C2D3).add(1).floor(),
    effect: value => Softcap.power(DC.D0_25.plusEffectOf(DilationUpgrade.du6Better).times(value).timesEffectOf(GameElement(53)), DC.E3, DC.D0_6),
    formatEffect: value => `+${formatPow(value)}`,
    softcapped: value => value.gte(DC.E3)
  },
  quarkGain: {
    id: 6,
    description: () => i18n.t("dilation_upgrade_6_description"),
    max: DC.D1,
    cost: () => DC.D1_5E191,
    bulk: value => (value.gte(DC.D1_5E191) ? DC.D1 : DC.D0),
    effect: () => DC.D5.pow(Currency.dilatedMass.value.max(1).log10().sqrt()),
    formatEffect: value => formatX(value)
  },
  du2Better: {
    id: 7,
    description: () => i18n.t("dilation_upgrade_7_description"),
    max: DC.D1,
    cost: () => DC.D1_5E246,
    bulk: value => (value.gte(DC.D1_5E246) ? DC.D1 : DC.D0)
  },
  starBoost: {
    id: 8,
    description: () => i18n.t("dilation_upgrade_8_description"),
    max: DC.D1,
    cost: () => DC.D1_5E296,
    bulk: value => (value.gte(DC.D1_5E296) ? DC.D1 : DC.D0),
    effect: () => MassUpgrade.tickspeed.boughtAmount.add(1).pow(DC.C2D3),
    formatEffect: value => formatX(value),
    isUnlocked: () => Stars.isUnlocked
  },
  doubleQuark: {
    id: 9,
    description: () => i18n.t("dilation_upgrade_9_description"),
    cost: value => DC.D1_5E536.times(DC.D5.pow(value)),
    bulk: value => value.div(DC.D1_5E536).log(DC.D5).add(1).floor(),
    effect: value => overflow(Softcap.power(DC.D2.pow(value), DC.E25, DC.C2D3), DC.EE200000, DC.D0_1),
    softcapped: value => value.gte(DC.E25),
    formatEffect: value => formatX(value),
    isUnlocked: () => Stars.isUnlocked
  },
  du6Better: {
    id: 10,
    description: () => i18n.t("dilation_upgrade_10_description", { value: format(0.015, 3) }),
    cost: value => DC.D1_5E1556.times(DC.E50.pow(value.pow(DC.D1_5))),
    bulk: value => value.div(DC.D1_5E1556).log10().div(DC.D50).pow(DC.C2D3).add(1).floor(),
    effect: value => Softcap.power(value.times(0.015).add(1), 1.2, 0.75).minus(1),
    formatEffect: value => formatPlus(value),
    softcapped: value => value.gte(DC.D0_2),
    isUnlocked: () => PlayerProgress.supernovaUnlocked()
  },
  first3Better: {
    id: 11,
    description: () => i18n.t("dilation_upgrade_11_description"),
    cost: value => DC.D1_5E8056.times(DC.E100.pow(value.pow(2))),
    bulk: value => value.div(DC.D1_5E8056).log10().div(DC.E2).sqrt().add(1).floor(),
    effect: value => Softcap.power(value.sqrt(), DC.D3_5, DC.D0_5).div(DC.E2).add(1),
    formatEffect: value => i18n.t("X_stronger", { value: formatPercents(value.minus(1)) }),
    softcapped: value => value.gte(DC.D3_5),
    isUnlocked: () => Bosons.areUnlocked
  }
};