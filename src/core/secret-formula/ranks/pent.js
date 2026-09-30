import { DC } from "@/core/constants";

export const pent = {
  id: "pent",
  isUnlocked() {
    return Radiation.isUnlocked;
  },
  requirement(amount) {
    return Scaling.pent.scaleEvery(amount).pow(DC.D1_5).add(15).floor();
  },
  bulk(value) {
    if (value.lt(15)) return DC.D0;
    return Scaling.pent.scaleEvery(value.minus(15).root(DC.D1_5), true).add(1).floor();
  },
  get scaling() {
    return Scaling.pent;
  },
  get noReset() {
    return NeutronUpgrade.qol8.canBeApplied;
  },
  get autoUnlocked() {
    return NeutronUpgrade.qol8.canBeApplied;
  },
  unlocks: [
    {
      id: "cheapTetrAndRank",
      description: () => i18n.t("pent_unlock_cheap_tetr_and_rank_description", {
        value1: formatPercents(0.15, 0),
        value2: formatX(1.1, 1)
      }),
      requirement: DC.D1,
      effects: {
        tetr: 0.85,
        rank: 1.1
      }
    },
    {
      id: "tetrBoostRadiation",
      description: () => i18n.t("pent_unlock_tetr_boost_radiation_description"),
      requirement: DC.D2,
      effect: () => Softcap.power(
        DC.D1_3.pow(RankType.tetr.amount),
        DC.D1_2E11,
        DC.D0_1
      ),
      softcapped: value => value.gte(DC.D1_2E11),
      formatEffect: value => formatX(value)
    },
    {
      id: "tickScale",
      description: () => i18n.t("pent_unlock_tick_scale_description"),
      requirement: DC.D4,
      effect: () => Currency.supernova.value.add(1).pow(DC.D0_2),
      formatEffect: value => i18n.t("X_later", { value: formatX(value, 0) })
    },
    {
      id: "rankScale",
      description: () => i18n.t("pent_unlock_rank_scale_description"),
      requirement: DC.D5,
      effect: () => DC.D1_05.pow(RankType.pent.amount.clampMax(DC.D1500)),
      cap: DC.D1_05.pow(DC.D1500),
      formatEffect: value => i18n.t("X_later", { value: formatX(value, 0) })
    },
    {
      id: "massSoftcapLater",
      description: () => i18n.t("pent_unlock_mass_softcap_later_description"),
      requirement: DC.D8,
      effect: () => DC.D1_1.pow(RankType.pent.amount),
      formatEffect: value => i18n.t("X_later", { value: formatX(value, 0) })
    },
    {
      id: "removeStrongerSoftcap",
      description: () => i18n.t("pent_unlock_remove_stronger_softcap_description"),
      requirement: DC.D15
    }
  ]
};