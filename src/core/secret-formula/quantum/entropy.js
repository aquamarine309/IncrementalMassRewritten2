import { DC } from "@/core/constants";

export const entropyRewards = {
  multiplier: {
    id: 0,
    name: () => i18n.t("entropy_reward_multiplier_name"),
    description: () => i18n.t("entropy_reward_multiplier_description"),
    baseReq: DC.E2,
    reqMult: DC.E1,
    effect: value => value.div(2).add(1).cbrt(),
    formatEffect: value => i18n.t("X_later", { value: formatX(value) })
  },
  accelerator: {
    id: 1,
    name: () => i18n.t("entropy_reward_accelerator_name"),
    description: () => i18n.t("entropy_reward_accelerator_description"),
    baseReq: DC.E3,
    reqMult: DC.D20,
    effect: value => value.sqrt().div(5).add(1),
    formatEffect: value => i18n.t("entropy_reward_accelerator_effect", { value: formatPercents(value.sub(1)) })
  },
  evaporation: {
    id: 2,
    name: () => i18n.t("entropy_reward_evaporation_name"),
    description: () => i18n.t("entropy_reward_evaporation_description"),
    baseReq: DC.E3,
    reqMult: DC.E1,
    scale: {
      start: DC.E1,
      effect: DC.D2
    },
    effect: value => DC.D3.pow(value),
    formatEffect: value => formatX(value)
  },
  converter: {
    id: 3,
    name: () => i18n.t("entropy_reward_converter_name"),
    description: () => i18n.t("entropy_reward_converter_description"),
    baseReq: DC.E4,
    reqMult: DC.D2,
    effect(value) {
      const power = Softcap.power(
        value.div(QuantumChallenges.isActive ? DC.E2 : DC.D5),
        DC.D2, DC.D0_5
      );
      return MassUpgrade.tickspeed.power.pow(power);
    },
    formatEffect: value => formatX(value)
  },
  booster: {
    id: 4,
    name: () => i18n.t("entropy_reward_booster_name"),
    description: () => i18n.t("entropy_reward_booster_description"),
    baseReq: DC.D2_5E5,
    reqMult: DC.D2,
    effect: value => value.pow(2).div(20).add(1),
    formatEffect: value => formatX(value, 2)
  },
  scaling: {
    id: 5,
    name: () => i18n.t("entropy_reward_scaling_name"),
    description: () => i18n.t("entropy_reward_scaling_description"),
    baseReq: DC.E7,
    reqMult: DC.E1,
    effect: value => value.sqrt().div(10).add(1).recip(),
    formatEffect: value => i18n.t("entropy_reward_scaling_effect", {
      value: formatPercents(DC.D1.minus(value)),
      weakerValue: i18n.t("X_weaker", { value: formatPercents(DC.D1.minus(value)) })
    })
  },
  condenser: {
    id: 6,
    name: () => i18n.t("entropy_reward_condenser_name"),
    description: () => i18n.t("entropy_reward_condenser_description"),
    baseReq: DC.E6,
    reqMult: DC.E2,
    scale: {
      start: DC.D5,
      effect: DC.D2_5
    },
    effect(value) {
      const base = Currency.entropy.value.add(1).log10().mul(2).add(1);
      return base.pow(value.pow(0.8));
    },
    formatEffect: value => formatX(value, 2)
  },
  radiation: {
    id: 7,
    name: () => i18n.t("entropy_reward_radiation_name"),
    description: () => i18n.t("entropy_reward_radiation_description"),
    baseReq: DC.E10,
    reqMult: DC.D1_5,
    scale: {
      start: DC.D20,
      effect: DC.D2_5
    },
    effect(value) {
      const base = Currency.entropy.value.add(1).log10().pow(DC.D0_75).mul(value).div(1500).add(1);
      return overflow(base, DC.D50, DC.D0_5);
    },
    formatEffect: value => formatPow(value)
  }
};