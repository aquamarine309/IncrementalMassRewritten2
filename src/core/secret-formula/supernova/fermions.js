import { DC } from "@/core/constants";
import Decimal from "break_eternity.js";
import { uni } from "@/core/math";

// Mrredshark showed his poor of physics
// The order of quarks and leptons is wrong in the origin version
// I need to keep them in a wrong order so as to look like the origin
// Quarks:    Leptons:
// 0 2 4      6 7 8
// 1 3 5      9 10 11
export const fermions = {
  quarks: {
    id: 0,
    currency: () => Currency.uQuarks,
    fermions: {
      up: {
        id: 0,
        key: "fermions_up",
        symbol: "u",
        description: () => i18n.t("fermion_up_description", { value: format(DC.D0_6, 1) }),
        effect: DC.D0_6,
        currency: () => Currency.atomicPower.value,
        currencyKey: "X_atomic_power",
        baseReq: DC.E800,
        reqMult: DC.E50,
        reqPow: DC.D1_25,
        reward: {
          description: () => i18n.t("fermion_up_reward_description"),
          effect: (tier, currency) => tier.pow(DC.D0_75).times(currency.max(DC.D1).log(DC.D1_1)),
          formatEffect: value => `+${format(value, 0)}`
        }
      },
      down: {
        id: 1,
        key: "fermions_down",
        symbol: "d",
        description: () => i18n.t("fermion_down_description", { value: formatInt(10) }),
        effect: DC.D0_1,
        currency: () => Currency.relativisticParticles.value,
        currencyKey: "X_relativistic_particle",
        baseReq: DC.E400,
        reqMult: DC.E50,
        reqPow: DC.D1_25,
        reward: {
          description: () => i18n.t("fermion_down_reward_description"),
          effect: (tier, currency) => Softcap.dilation(
            DC.E5.pow(currency.add(DC.D1).log10().times(tier)),
            DC.E1000,
            DC.D0_95
          ),
          formatEffect: value => formatX(value),
          softcapped: value => value.gte(DC.E1000)
        }
      },
      charm: {
        id: 2,
        key: "fermions_charm",
        symbol: "c",
        description: () => i18n.t("fermion_charm_description"),
        effect: DC.D2,
        currency: () => Currency.mass.value,
        currencyKey: "",
        formatAsMass: true,
        baseReq: DC.D1_5E36056,
        reqMult: DC.E1000,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_charm_reward_description"),
          effect: (tier, currency) => Softcap.power(
            Softcap.power(
              currency.add(DC.D1).log10().pow(DC.D1_75).times(tier.pow(DC.D0_8)).div(DC.E2).add(DC.D1),
              DC.D5,
              DC.D0_75
            ),
            DC.D449,
            DC.D0_25
          ),
          formatEffect: value => `+${formatPercents(value.minus(DC.D1))}`,
          softcapped: value => value.gte(DC.D5)
        }
      },
      strange: {
        id: 3,
        key: "fermions_strange",
        symbol: "s",
        description: () => i18n.t("fermion_strange_description"),
        maxTier: () => DC.D15.plusEffectsOf(
          NeutronUpgrade.fn9,
          NeutronUpgrade.fn11
        ),
        currency: () => Currency.ragePowers.value,
        currencyKey: "X_rage_power",
        baseReq: DC.E3E4,
        reqMult: DC.E1000,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_strange_reward_description"),
          effect: (tier, currency) => Softcap.power(Softcap.power(
            currency.clampMin(DC.D1).log10().add(DC.D1).times(tier).pow(DC.D0_9).div(DC.E2).add(DC.D1),
            DC.D1_5, DC.D0_5), DC.D5, DC.C1D3),
          formatEffect: value => formatX(value),
          softcapped: value => value.gte(DC.D1_5),
          cap: () => DC.D6_5,
        }
      },
      top: {
        id: 4,
        key: "fermions_top",
        symbol: "t",
        description: () => i18n.t("fermion_top_description"),
        maxTier: () => DC.D30.plusEffectOf(NeutronUpgrade.fn11),
        currency: () => Currency.dilatedMass.value,
        currencyKey: "X_dilated_mass",
        formatAsMass: true,
        baseReq: uni(DC.E5_75E5),
        reqMult: DC.EE4,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_top_reward_description"),
          effect: (tier, currency) => Softcap.power(Softcap.power(
            currency.add(DC.D1).log10().div(DC.D500).times(tier.sqrt()).add(DC.D1),
            DC.D1_15, DC.D0_5), DC.D1_8, DC.C1D3),
          formatEffect: value => formatDiv(value),
          softcapped: value => value.gte(DC.D1_15),
          cap: () => DC.D2
        }
      },
      bottom: {
        id: 5,
        key: "fermions_bottom",
        symbol: "b",
        description: () => i18n.t("fermion_bottom_description"),
        maxTier: () => DC.E1.plusEffectOf(NeutronUpgrade.fn11),
        currency: () => MassUpgrade.tickspeed.effectValue,
        currencyKey: "X_of_tickspeed",
        baseReq: DC.E6E9,
        reqMult: DC.E5E8,
        reqPow: DC.D2,
        reward: {
          description: () => i18n.t("fermion_bottom_reward_description"),
          effect: (tier, currency) => currency.add(DC.D1).log10().sqrt().div(DC.D150).add(1).pow(tier).clampMax(DC.D500),
          formatEffect: value => formatX(value),
          cap: DC.E500
        }
      },
    }
  },
  leptons: {
    id: 1,
    currency: () => Currency.uLeptons,
    fermions: {
      electron: {
        id: 6,
        key: "fermions_electron",
        symbol: "e",
        description: () => i18n.t("fermion_electron_description", { value: formatPow(DC.D0_625, 3) }),
        maxTier: () => (NeutronUpgrade.fn10.canBeApplied ? Decimal.dInf : DC.D15.plusEffectOf(NeutronUpgrade.fn5)),
        effect: DC.D0_625,
        currency: () => Currency.quark.value,
        currencyKey: "X_quark",
        baseReq: DC.E175,
        reqMult: DC.E5,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_electron_reward_description"),
          effect: (tier, currency) => Softcap.power(
            currency.add(DC.D1).log10().times(tier).div(DC.E2).add(DC.D1),
            DC.D1_5,
            NeutronUpgrade.fn5.canBeApplied ? DC.D0_75 : DC.D0_25
          ).powEffectOf(NeutronUpgrade.fn10),
          formatEffect: value => formatPow(value),
          softcapped: value => value.gte(DC.D1_5)
        }
      },
      meon: {
        id: 7,
        key: "fermions_meon",
        symbol: "μ",
        description: () => i18n.t("fermion_meon_description", { value: formatInt(-1) }),
        currency: () => Currency.blackHole.value,
        currencyKey: "X_black_hole",
        formatAsMass: true,
        baseReq: DC.E6E5,
        reqMult: DC.E4E4,
        reqPow: DC.D1_25,
        reward: {
          description: () => i18n.t("fermion_meon_reward_description"),
          effect: (tier, currency) => {
            const effect = Softcap.power(
              tier.pow(DC.D1_5).add(DC.D1).pow(Softcap.power(
                currency.add(DC.D1).log10(),
                DC.E1,
                DC.D0_75
              )),
              DC.E6,
              DC.D0_75
            );
            // An overflow exists in C16
            return effect;
          },
          softcapped: value => value.gte(DC.E6),
          formatEffect: value => formatX(value)
        }
      },
      tau: {
        id: 8,
        key: "fermions_tau",
        symbol: "τ",
        description: () => i18n.t("fermion_tau_description"),
        currency: () => Currency.darkMatter.value,
        currencyKey: "X_dark_matter",
        baseReq: DC.E4_5E5,
        reqMult: DC.E5000,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_tau_reward_description"),
          effect: (tier, currency) => tier.pow(DC.D0_8).times(DC.D0_025).add(DC.D1).pow(currency.add(DC.D1).log10()),
          formatEffect: value => formatDiv(value)
        }
      },
      neutrino: {
        id: 9,
        key: "fermions_neutrino",
        symbol: "ν<sub>e</sub>",
        description: () => i18n.t("fermion_neutrino_description", { value: formatPow(0.5, 1) }),
        effect: DC.D0_5,
        maxTier: () => DC.D15.plusEffectsOf(
          NeutronUpgrade.fn9,
          NeutronUpgrade.fn11
        ),
        currency: () => Currency.stars.value,
        currencyKey: "X_collapsed_star",
        baseReq: DC.E1600,
        reqMult: DC.E400,
        reqPow: DC.D1_5,
        reward: {
          description: () => i18n.t("fermion_neutrino_reward_description"),
          effect: (tier, currency) => Softcap.power(
            currency.add(DC.D1).log10().add(DC.D1).times(tier).div(DC.D200).add(DC.D1),
            DC.D1_5,
            DC.D0_5
          ).recip(),
          formatEffect: value => `/${format(value.recip())}`,
          softcapped: value => value.gte(DC.D1_5)
        }
      },
      neutMeon: {
        id: 10,
        key: "fermions_neut_meon",
        symbol: "ν<sub>μ</sub>",
        maxTier: () => DC.D25.plusEffectOf(NeutronUpgrade.fn11),
        description: () => i18n.t("fermion_neut_meon_description"),
        currency: () => Currency.atoms.value,
        currencyKey: "X_atom",
        baseReq: DC.E3_5E8,
        reqMult: DC.E1_5E7,
        reqPow: DC.D2,
        reward: {
          description: () => i18n.t("fermion_neut_meon_reward_description"),
          effect: (tier, currency) => {
            const amount = currency.add(DC.D1).log10().times(tier).pow(DC.D0_25);
            return DC.D0_95.pow(Softcap.power(amount, DC.D27, DC.D0_5)).clampMin(DC.C2D3);
          },
          formatEffect: value => i18n.t("X_weaker", { value: formatPercents(DC.D1.minus(value)) })
        }
      },
      neutTau: {
        id: 11,
        key: "fermions_neut_tau",
        symbol: "ν<sub>τ</sub>",
        description: () => i18n.t("fermion_neut_tau_description"),
        currency: () => MassUpgrade.tickspeed.power,
        currencyKey: "X_of_tickspeed_power",
        baseReq: DC.E80,
        reqPow: DC.D1_5,
        reqMult: DC.E1,
        reward: {
          description: () => i18n.t("fermion_neut_tau_reward_description"),
          effect: (tier, currency) => currency.add(DC.D1).log10().pow(DC.D0_75).div(DC.E2).add(DC.D1).pow(tier.pow(DC.D0_75)),
          formatEffect: value => formatDiv(value)
        }
      }
    }
  }
};