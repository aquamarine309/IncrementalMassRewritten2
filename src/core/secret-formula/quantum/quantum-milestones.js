import { DC } from "@/core/constants";

export const quantumMilestones = {
  keepQolTree: {
    description: () => i18n.t("quantum_milestone_keep_qol_tree_description"),
    requirement: DC.D1
  },
  removeReqAndSpeedUp: {
    description: () => i18n.t("quantum_milestone_remove_req_and_speed_up_description", { value: formatX(10, 0) }),
    effect: DC.E1,
    requirement: DC.D2
  },
  keepChallengeTree: {
    description: () => i18n.t("quantum_milestone_keep_challenge_tree_description"),
    requirement: DC.D3
  },
  unlockRadiation: {
    description: () => i18n.t("quantum_milestone_unlock_radiation_description"),
    requirement: DC.D5
  },
  doubleQF: {
    description: () => i18n.t("quantum_milestone_double_qf_description"),
    effect: DC.D2,
    requirement: DC.D6
  },
  speedBoost: {
    description: () => i18n.t("quantum_milestone_speed_boost_description"),
    requirement: DC.D8
  },
  quantizesBoostStars: {
    description: () => i18n.t("quantum_milestone_quantizes_boost_stars_description", { value: formatX(DC.E10, 0) }),
    effect: () => {
      let effect = DC.D1_2.pow(Softcap.power(Currency.quantizes.value, DC.E17, DC.D0_1));
      effect = effect.clampMax(DC.E10);
      effect = Softcap.power(effect, DC.EE9, DC.D0_01);
      effect = Softcap.power(effect, DC.EE10, DC.D0_1);
      return effect;
    },
    formatEffect: value => formatX(value),
    requirement: DC.E1
  }
};