import { DC } from "@/core/constants";
import Decimal from "break_eternity.js";

export const rank = {
  id: "rank",
  isUnlocked() {
    return true;
  },
  requirement(amount) {
    return Decimal.pow10(Scaling.rank.scaleEvery(
      amount,
      false,
      [null, null, null, null, Chroma[1].effectOrDefault(0)]
    )
      .timesEffectsOf(
        RankType.tier.unlocks.reduceRankReq,
        Challenge(5).reward
      ).pow(1.15)
    ).times(10);
  },
  bulk(value) {
    if (value.lt(10)) return DC.D0;
    return Scaling.rank.scaleEvery(
      value.div(10).log10().root(1.15)
        .dividedByEffectsOf(
          RankType.tier.unlocks.reduceRankReq,
          Challenge(5).reward
        ), true,
      [null, null, null, null, Chroma[1].effectOrDefault(0)]
    ).add(1).floor();
  },
  get scaling() {
    return Scaling.rank;
  },
  get noReset() {
    return RageUpgrade(3).canBeApplied;
  },
  get autoUnlocked() {
    return RageUpgrade(4).canBeApplied;
  },
  get isDisabled() {
    return Challenge(5).canBeApplied;
  },
  unlocks: [
    {
      id: "unlockMuscler",
      requirement: 1,
      description: () => i18n.t("rank_unlocks_unlock_muscler")
    },
    {
      id: "unlockBooster",
      requirement: 2,
      description: () => i18n.t("rank_unlocks_unlock_booster", { value: formatPercents(0.2, 0) }),
      effect: 0.8
    },
    {
      id: "unlockStronger",
      requirement: 3,
      description: () => i18n.t("rank_unlocks_unlock_stronger", { value: formatPercents(0.2, 0) }),
      effects: {
        cost: DC.D0_8,
        boost: () => MassUpgrade.muscler.boughtAmount.div(20)
      },
      formatEffect: effects => formatPlus(effects.boost)
    },
    {
      id: "mu3cheaper",
      requirement: 4,
      description: () => i18n.t("rank_unlocks_mu3_cheaper", { value: formatPercents(0.2, 0) }),
      effect: 0.8
    },
    {
      id: "mu2boost",
      requirement: 5,
      description: () => i18n.t("rank_unlocks_mu2_boost"),
      effect: () => MassUpgrade.booster.boughtAmount.div(40),
      formatEffect: value => formatPlus(value)
    },
    {
      id: "rankBoostsMass",
      requirement: 6,
      description: () => i18n.t("rank_unlocks_rank_boost_mass", {
        value1: formatInt(1),
        value2: formatInt(2)
      }),
      effect: () => overflow(RankType.rank.amount.add(1)
        .pow(RankType.rank.unlocks.improveRank6.effectOrDefault(2)), DC.EE100, DC.D0_5),
      formatEffect: value => formatX(value)
    },
    {
      id: "tripleMassGain",
      requirement: 13,
      description: () => i18n.t("rank_unlocks_triple_mass_gain"),
      effect: 3
    },
    {
      id: "doubleRPGain",
      requirement: 14,
      description: () => i18n.t("rank_unlocks_double_rp_gain"),
      effect: 2
    },
    {
      id: "improveRank6",
      requirement: 17,
      description: () => i18n.t("rank_unlock_improve_rank_6_description", {
        value1: formatInt(1),
        value2: formatInt(2),
        value3: formatInt(1),
        value4: formatInt(3)
      }),
      effect: () => RankType.rank.amount.add(1).cbrt(),
      formatEffect: value => formatX(RankType.rank.amount.add(1).pow(value.minus(DC.D2)))
    },
    {
      id: "mu3softcap",
      requirement: 34,
      description: () => i18n.t("rank_unlock_mu3_softcap_description", { value: formatInt(2) }),
      effect: 2
    },
    {
      id: "rankBoostTickPower",
      requirement: 40,
      description: () => i18n.t("rank_unlock_rank_boost_tick_power_description"),
      effect: () => {
        const root = Effects.min(
          DC.D2,
          RankType.rank.unlocks.improveRank40,
          RankType.rank.unlocks.overpowerRank40
        );
        return RankType.rank.amount.root(root).div(100);
      },
      formatEffect: value => `+${formatPercents(value)}`
    },
    {
      id: "rankBoostRP",
      requirement: 45,
      description: () => i18n.t("rank_unlock_rank_boost_rp_description"),
      effect: () => RankType.rank.amount.add(1).pow(1.5),
      formatEffect: value => formatX(value)
    },
    {
      id: "improveRank40",
      requirement: 90,
      description: () => i18n.t("rank_unlock_improve_rank_40_description"),
      effect: 1.6
    },
    {
      id: "massGainPower",
      requirement: 180,
      description: () => i18n.t("rank_unlock_mass_gain_power_description", { value: format(1.025, 3) }),
      effect: 1.025
    },
    {
      id: "overpowerRank40",
      requirement: 220,
      description: () => i18n.t("rank_unlock_overpower_rank_40_description"),
      effect: 1
    },
    {
      id: "quarkGain",
      requirement: 300,
      description: () => i18n.t("rank_unlock_quark_gain_description"),
      effect: () => RankType.rank.amount.add(1),
      formatEffect: value => formatX(value)
    },
    {
      id: "massGain",
      requirement: 380,
      description: () => i18n.t("rank_unlock_mass_gain_description"),
      effect: () => Softcap.power(RankType.rank.amount.minus(379).pow(1.5).powEffectOf(
        RankType.tier.unlocks.tierBoostRank380
      ), DC.E3, DC.D0_5).pow10(),
      formatEffect: value => formatX(value)
    },
    {
      id: "massSoftcap",
      requirement: 800,
      description: () => i18n.t("rank_unlock_mass_softcap_description", {
        value1: formatPercents(0.0025, 2),
        value2: formatPercents(0.25, 0)
      }),
      effect: () => DC.D2.minus(Softcap.power(RankType.rank.amount.minus(799).times(0.0025).add(1), DC.D1_25, DC.D0_5)).clampMin(DC.D0_75),
      formatEffect: value => formatPercents(DC.D1.minus(value))
    }
  ]
};