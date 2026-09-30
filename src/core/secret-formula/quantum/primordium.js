import { DC } from "@/core/constants";

export const primordium = {
  delta: {
    id: 0,
    key: "delta",
    symbol: "Δ",
    weight: 6,
    effectList: [
      {
        description: value => i18n.t("primordium_delta_effect_0_description", { value: formatX(value) }),
        effect: value => value.add(1).sqrt()
      }
    ]
  },
  alpha: {
    id: 1,
    key: "alpha",
    symbol: "Α",
    weight: 6,
    effectList: [
      {
        description: value => i18n.t("primordium_alpha_effect_0_description", { value: formatPow(value) }),
        effect: value => {
          // TODO
          const br16 = false;
          let result = value.cbrt().times(DC.D0_2).add(1);
          result = Softcap.power(result, DC.D3, DC.D0_4, br16);
          if (br16) result = result.pow(DC.D1_5);
          return result;
        }
      },
      {
        description: value => i18n.t("primordium_alpha_effect_1_description", { value: formatX(value) }),
        effect: value => value.pow(DC.D1_25).add(1)
      }
    ]
  },
  omega: {
    id: 2,
    key: "omega",
    symbol: "Ω",
    weight: 6,
    effectList: [
      {
        description: value => i18n.t("primordium_omega_effect_0_description", { value: formatPow(value) }),
        effect: value => {
          // TODO
          const br16 = false;
          let result = value.cbrt().times(DC.D0_2).add(1);
          result = Softcap.power(result, DC.D3, DC.D0_4, br16);
          if (br16) result = result.pow(DC.D1_5);
          return result;
        }
      },
      {
        description: value => i18n.t("primordium_omega_effect_1_description", { value: formatX(value) }),
        effect: value => DC.D3.pow(value.pow(DC.D0_75))
      }
    ]
  },
  sigma: {
    id: 3,
    key: "sigma",
    symbol: "Σ",
    weight: 6,
    effectList: [
      {
        description: value => i18n.t("primordium_sigma_effect_0_description", { value: formatPow(value) }),
        effect: value => {
          const br16 = false;
          let result = value.cbrt().times(DC.D0_2).add(1);
          result = Softcap.power(result, DC.D3, DC.D0_4, br16);
          if (br16) result = result.pow(DC.D1_5);
          return result;
        }
      },
      {
        description: value => i18n.t("primordium_sigma_effect_1_description", { value: formatX(value) }),
        effect: value => DC.D2.pow(value.pow(DC.D0_75))
      }
    ]
  },
  phi: {
    id: 4,
    key: "phi",
    symbol: "Φ",
    weight: 2,
    effectList: [
      {
        description: value => i18n.t("primordium_phi_effect_0_description", { value: formatX(value) }),
        effect: value => value.add(1).pow(DC.D0_1)
      }
    ]
  },
  epsilon: {
    id: 5,
    key: "epsilon",
    symbol: "Ε",
    weight: 2,
    effectList: [
      {
        description: value => i18n.t("primordium_epsilon_effect_0_description", { value: format(value, 2) }),
        effect: value => value.cbrt().times(DC.D0_1)
      },
      {
        isUnlocked: () => NeutronUpgrade.prim3.canBeApplied,
        description: value => i18n.t("primordium_epsilon_effect_1_description", { value: format(value, 2) }),
        effect: value => value.cbrt().powEffectOf(NeutronUpgrade.prim3)
      }
    ]
  },
  theta: {
    id: 6,
    key: "theta",
    symbol: "Θ",
    weight: 2,
    effectList: [
      {
        description: value => i18n.t("primordium_theta_effect_0_description", { value: formatX(value) }),
        effect: value => DC.D5.pow(value.pow(DC.D0_75))
      },
      {
        isUnlocked: () => NeutronUpgrade.prim2.canBeApplied,
        description: value => i18n.t("primordium_theta_effect_1_description", { value: formatPow(value) }),
        effect: value => value.pow(DC.D0_2).times(DC.D0_1).add(1)
      }
    ]
  },
  beta: {
    id: 7,
    key: "beta",
    symbol: "Β",
    weight: 1,
    effectList: [
      {
        description: value => i18n.t("primordium_beta_effect_0_description", { value: format(value, 0) }),
        effect: value => {
          const result = value.pow(DC.D0_9).times(2);
          return Softcap.power(result, DC.D1500, DC.D0_5);
        }
      }
    ]
  }
};