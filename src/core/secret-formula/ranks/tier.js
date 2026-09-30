import { DC } from "@/core/constants";

export const tier = {
  id: "tier",
  isUnlocked() {
    return RankType.rank.amount.gte(3) || RankType.tier.amount.gte(1) || PlayerProgress.rageUnlocked();
  },
  get scaling() {
    return Scaling.tier;
  },
  get noReset() {
    return BHUpgrade(3).canBeApplied;
  },
  get autoUnlocked() {
    return RageUpgrade(5).canBeApplied;
  },
  requirement(amount) {
    let req = Scaling.tier.scaleEvery(
      amount,
      false,
      [null, null, null, Chroma[1].effectOrDefault(0)]
    ).timesEffectsOf(
      RankType.tetr.unlocks.ranksReqAndScaling.effects.tier,
      FermionType.leptons.fermions.neutrino.reward
    );
    if (AtomUpgrade(9).canBeApplied) {
      req = req.times(DC.D0_5);
    }
    return req.add(2).pow(2).round();
  },
  bulk(currency) {
    let rank = currency.sqrt().minus(2)
      .dividedByEffectsOf(
        RankType.tetr.unlocks.ranksReqAndScaling.effects.tier,
        FermionType.leptons.fermions.neutrino.reward
      );
    if (AtomUpgrade(9).canBeApplied) {
      rank = rank.times(DC.D2);
    }
    return Scaling.tier.scaleEvery(
      rank,
      true,
      [null, null, null, Chroma[1].effectOrDefault(0)]
    ).add(1).floor();
  },
  unlocks: [
    {
      id: "reduceRankReq",
      requirement: 1,
      description: () => i18n.t("tier_unlock_reduce_rank_req_description", { value: formatPercents(0.2, 0) }),
      effect: 0.8
    },
    {
      id: "raiseMassGain",
      requirement: 2,
      description: () => i18n.t("tier_unlock_raise_mass_gain_description", { value: format(1.15, 2) }),
      effect: 1.15
    },
    {
      id: "upgradeLessCost",
      requirement: 3,
      description: () => i18n.t("tier_unlock_upgrade_less_cost_description", { value: formatPercents(0.2, 0) }),
      effect: 0.8
    },
    {
      id: "tickPowerFromTier",
      requirement: 4,
      description: () => i18n.t("tier_unlock_tick_power_from_tier_description", {
        value1: formatPercents(0.05, 0),
        value2: formatPercents(0.4, 0)
      }),
      effect: () => {
        const tier12 = RankType.tier.unlocks.improveTier4.canBeApplied;
        const effect = RankType.tier.amount.times(tier12 ? 0.1 : 0.05);
        if (tier12) return effect;
        return Softcap.power(effect.add(1), DC.D1_4, DC.D0_75).minus(1);
      },
      formatEffect: value => `+${formatPercents(value)}`
    },
    {
      id: "tierBoostRP",
      requirement: 6,
      description: () => i18n.t("tier_unlock_tier_boost_rp_description"),
      effect: () => DC.D2.pow(RankType.tier.amount
        .timesEffectOf(RankType.tier.unlocks.tier6FromDM)),
      formatEffect: value => formatX(value)
    },
    {
      id: "tier6FromDM",
      requirement: 8,
      description: () => i18n.t("tier_unlock_tier_6_from_dm_description"),
      effect: () => Currency.darkMatter.value.clampMin(1).log10().add(1).sqrt(),
      formatEffect: value => formatPow(value)
    },
    {
      id: "improveTier4",
      requirement: 12,
      description: () => i18n.t("tier_unlock_improve_tier_4_description"),
      effect: 2
    },
    {
      id: "strongerCapWeak",
      requirement: 30,
      description: () => i18n.t("tier_unlock_stronger_cap_weak_description", { value: formatPercents(0.1, 0) }),
      effect: 1.1
    },
    {
      id: "tierBoostRank380",
      requirement: 55,
      description: () => i18n.t("tier_unlock_tier_boost_rank_380_description"),
      effect: () => RankType.tier.amount.clampMin(1).log10().add(1).root(4),
      formatEffect: value => formatPow(value)
    },
    {
      id: "superTetrLater",
      requirement: 100,
      description: () => i18n.t("tier_unlock_super_tetr_later_description", { value: formatInt(5) }),
      effect: 5
    }
  ]
};