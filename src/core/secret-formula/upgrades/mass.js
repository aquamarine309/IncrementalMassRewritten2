import { DC } from "@/core/constants";
import { getLinearCost, getLinearBulk } from "@/core/math";

const _powerLazy = {
  muscler: new Lazy(() => {
    let power = DC.D1;
    power = power.plusEffectOf(RankType.rank.unlocks.unlockStronger.effects.boost);
    power = power.timesEffectOf(MassUpgrade.booster);
    return power;
  }).invalidateOn(GAME_EVENT.GAME_TICK_AFTER),

  booster: new Lazy(() => {
    let power = DC.D2;
    power = power.plusEffectOf(RankType.rank.unlocks.mu2boost);
    power = power.powEffectOf(MassUpgrade.stronger);
    return power;
  }).invalidateOn(GAME_EVENT.GAME_TICK_AFTER),

  stronger: new Lazy(() => {
    let power = DC.D1;
    power = power.plusEffectsOf(
      RageUpgrade(8),
      RageUpgrade(11),
      RankType.tetr.unlocks.strongerBoost
    );
    power = power.timesEffectsOf(GameElement(4), DilationUpgrade.strongerPower);
    power = Softcap.power(power, DC.E43, DC.D0_75);
    return power;
  }).invalidateOn(GAME_EVENT.GAME_TICK_AFTER),
};

export const mass = {
  muscler: {
    id: "muscler",
    get currency() {
      return Currency.mass;
    },
    get baseCost() {
      return DC.E1;
    },
    get costMult() {
      return DC.D1_5.powEffectsOf(
        RankType.rank.unlocks.unlockBooster,
        RankType.tier.unlocks.upgradeLessCost
      );
    },
    get scaling() {
      return Scaling.massUpgrade;
    },
    cost(amount) {
      const $ = MassUpgrade.muscler.config;
      return getLinearCost(
        $.scaling.scaleEvery(amount),
        $.baseCost,
        $.costMult
      );
    },
    bulk(currency) {
      const $ = MassUpgrade.muscler.config;
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult), true).add(1).floor();
    },
    get freeAmount() {
      return RageUpgrade(0).effectOrDefault(DC.D0)
        .timesEffectOf(EntropyRewards.booster);
    },
    get isUnlocked() {
      return RankType.rank.unlocks.unlockMuscler.canBeApplied || AtomUpgrade(0).canBeApplied;
    },
    get forceVisible() {
      return PlayerProgress.rageUnlocked();
    },
    get autoUnlocked() {
      return RageUpgrade(2).canBeApplied;
    },
    get isFree() {
      return BHUpgrade(0).canBeApplied;
    },
    get power() {
      return _powerLazy.muscler.value;
    },
    formatPower: value => `+${formatMass(value)}`,
    effect($) {
      const power = $.power;
      const amount = $.totalAmount;
      return amount.times(power);
    },
    formatEffect: value => i18n.t("muscler_effect", { value: formatMass(value) }),
    upgClass: "i-mass-upgrade-1"
  },
  booster: {
    id: "booster",
    get currency() {
      return Currency.mass;
    },
    get baseCost() {
      return DC.E2;
    },
    get costMult() {
      return DC.D4.powEffectsOf(
        RankType.rank.unlocks.unlockStronger.effects.cost,
        RankType.tier.unlocks.upgradeLessCost
      );
    },
    get scaling() {
      return Scaling.massUpgrade;
    },
    cost(amount) {
      const $ = MassUpgrade.booster.config;
      return getLinearCost(
        $.scaling.scaleEvery(amount),
        $.baseCost,
        $.costMult
      );
    },
    bulk(currency) {
      const $ = MassUpgrade.booster.config;
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult), true).add(1).floor();
    },
    get freeAmount() {
      return RageUpgrade(1).effectOrDefault(DC.D0)
        .timesEffectOf(EntropyRewards.booster);
    },
    get isUnlocked() {
      return RankType.rank.unlocks.unlockBooster.canBeApplied || AtomUpgrade(0).canBeApplied;
    },
    get forceVisible() {
      return PlayerProgress.rageUnlocked();
    },
    get autoUnlocked() {
      return RageUpgrade(2).canBeApplied;
    },
    get isFree() {
      return BHUpgrade(0).canBeApplied;
    },
    get power() {
      return _powerLazy.booster.value;
    },
    formatPower: value => `+${format(value)}x`,
    effect($) {
      const power = $.power;
      const amount = $.totalAmount;
      return amount.times(power).add(1);
    },
    formatEffect: value => i18n.t("booster_effect", { value: formatX(value) }),
    upgClass: "i-mass-upgrade-2"
  },
  stronger: {
    id: "stronger",
    get currency() {
      return Currency.mass;
    },
    get baseCost() {
      return DC.E3;
    },
    get costMult() {
      return DC.D9.powEffectsOf(
        RankType.rank.unlocks.mu3cheaper,
        RankType.tier.unlocks.upgradeLessCost
      );
    },
    get scaling() {
      return Scaling.massUpgrade;
    },
    cost(amount) {
      const $ = MassUpgrade.stronger.config;
      return getLinearCost(
        $.scaling.scaleEvery(amount),
        $.baseCost,
        $.costMult
      );
    },
    bulk(currency) {
      const $ = MassUpgrade.stronger.config;
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult), true).add(1).floor();
    },
    get freeAmount() {
      return RageUpgrade(6).effectOrDefault(DC.D0)
        .timesEffectOf(EntropyRewards.booster);
    },
    get isUnlocked() {
      return RankType.rank.unlocks.unlockStronger.canBeApplied || AtomUpgrade(0).canBeApplied;
    },
    get forceVisible() {
      return PlayerProgress.rageUnlocked();
    },
    get autoUnlocked() {
      return RageUpgrade(2).canBeApplied;
    },
    get isFree() {
      return BHUpgrade(0).canBeApplied;
    },
    get power() {
      return _powerLazy.stronger.value;
    },
    formatPower: value => `+${formatPow(value)}`,
    effect($) {
      const power = $.power;
      const amount = $.totalAmount.powEffectOf(GameElement(81));
      let effect = amount.times(power).timesEffectOf(GameElement(80)).add(1);
      const softcaps = MassUpgradeSoftcap.stronger;
      effect = Softcap.power(effect, softcaps[0].start, softcaps[0].scale);
      effect = Softcap.power(effect, softcaps[1].start, softcaps[1].scale);
      effect = effect.timesEffectOf(PrimordiumParticle.delta.effects[0]);
      effect = Softcap.power(effect, softcaps[2].start, softcaps[2].scale);
      effect = overflow(effect, DC.E115, DC.D0_5);
      effect = overflow(effect, DC.E1555, DC.D0_25);
      return effect;
    },
    softcapLevel(effect) {
      const softcaps = MassUpgradeSoftcap.stronger;
      return MassUpgradeSoftcap.softcapLevel(effect, softcaps);
    },
    formatEffect: value => i18n.t("stronger_effect", { value: formatPow(value) }),
    upgClass: "i-mass-upgrade-3"
  },
  overpower: {
    id: "overpower",
    get currency() {
      return Currency.mass;
    },
    get baseCost() {
      return DC.E100;
    },
    get costMult() {
      return DC.D1_5;
    },
    get scaling() {
      return Scaling.overpower;
    },
    get isUnlocked() {
      return false;
    },
    get autoUnlocked() {
      return RageUpgrade(2).canBeApplied;
    },
    get isFree() {
      return BHUpgrade(0).canBeApplied;
    },
    cost(amount) {
      return amount;
    },
    bulk(currency) {
      return currency;
    },
    get power() {
      return DC.D1;
    },
    formatPower: () => "Unknown",
    effect($) {
      const power = $.power;
      const amount = $.totalAmount;
      return amount.times(power).add(1);
    },
    formatEffect: () => "Unknown",
    upgClass: "i-mass-upgrade-4"
  },
  tickspeed: {
    id: "tickspeed",
    get currency() {
      return Currency.ragePowers;
    },
    get baseCost() {
      return DC.D1;
    },
    get costMult() {
      return DC.D2;
    },
    get scaling() {
      return Scaling.tickspeed;
    },
    cost(amount) {
      const $ = MassUpgrade.tickspeed.config;
      return getLinearCost(
        $.scaling.scaleEvery(
          amount,
          false,
          [null, null, null, FermionType.leptons.fermions.tau.reward.effectOrDefault(null)]
        ),
        $.baseCost,
        $.costMult
      );
    },
    bulk(currency) {
      const $ = MassUpgrade.tickspeed.config;
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult),
        true,
        [null, null, null, FermionType.leptons.fermions.tau.reward.effectOrDefault(null)]
      ).add(1).floor();
    },
    get freeAmount() {
      return Atom.freeTickspeeds.timesEffectOf(EntropyRewards.booster);
    },
    get isUnlocked() {
      return PlayerProgress.rageUnlocked();
    },
    get autoUnlocked() {
      return BHUpgrade(4).canBeApplied;
    },
    get disabled() {
      return Challenge(2).canBeApplied || Challenge(6).canBeApplied;
    },
    get isFree() {
      return AtomUpgrade(1).canBeApplied;
    },
    onPurchased() {
      player.checks.supernova.noTick = false;
    },
    get power() {
      let power = DC.D1_5;
      power = power.plusEffectsOf(
        RankType.tier.unlocks.tickPowerFromTier,
        RankType.rank.unlocks.rankBoostTickPower,
        Challenge(2).reward,
        Challenge(6).reward
      );
      power = power.add(Atom.protonTick());
      power = power.timesEffectOf(Boson.zBoson.effects.tickspeed);
      power = power.times(MassDilation.boost);
      power = power.powEffectsOf(
        NeutronUpgrade.t1,
        Chroma[0]
      );
      let softcapStart = DC.E50.timesEffectOf(RadiationType.ultraviolet.boosts[1]);
      let softcapPower = DC.D0_1;
      if (GameElement(86).canBeApplied) {
        softcapStart = softcapStart.pow(2);
        softcapPower = softcapPower.sqrt();
      }
      power = Softcap.power(
        power,
        softcapStart,
        softcapPower
      );
      return power;
    },
    formatPower: value => (value.gte(10) ? formatX(value) : formatPercents(value.minus(1))),
    effect($) {
      const power = $.power;
      const bought = $.boughtAmount;
      const free = $.freeAmount;
      return power.pow(
        bought.timesEffectsOf(
          GameElement(63),
          RadiationType.radio.boosts[1],
          PrimordiumParticle.alpha.effects[1]
        ).add(free).timesEffectOf(GameElement(80))
      ).powEffectsOf(
        RankType.tetr.unlocks.tickspeedPower,
        GameElement(18)
      );
    },
    formatEffect: value => i18n.t("tickspeed_effect", { value: formatX(value) }),
    upgClass: "i-tickspeed"
  },
  condenser: {
    id: "condenser",
    get currency() {
      return Currency.darkMatter;
    },
    get baseCost() {
      return DC.D1;
    },
    get costMult() {
      return DC.D1_75;
    },
    get scaling() {
      return Scaling.condenser;
    },
    get freeAmount() {
      return BHUpgrade(14).effectOrDefault(DC.D1)
        .timesEffectOf(EntropyRewards.booster);
    },
    cost(amount) {
      const $ = MassUpgrade.condenser.config;
      const cheap = FermionType.leptons.fermions.neutTau.reward.effectOrDefault(null);
      return getLinearCost(
        $.scaling.scaleEvery(amount, false, [null, null, null, cheap]),
        $.baseCost,
        $.costMult
      ).floor();
    },
    bulk(currency) {
      const $ = MassUpgrade.condenser.config;
      const cheap = FermionType.leptons.fermions.neutTau.reward.effectOrDefault(null);
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult), true, [null, null, null, cheap]).add(1).floor();
    },
    get isUnlocked() {
      return PlayerProgress.blackHoleUnlocked();
    },
    get autoUnlocked() {
      return AtomUpgrade(1).canBeApplied;
    },
    get disabled() {
      return Challenge(6).canBeApplied;
    },
    onPurchased() {
      player.checks.supernova.noCondenser = false;
    },
    get power() {
      let power = DC.D2;
      power = power.plusEffectOf(Challenge(6).reward);
      power = power.timesEffectOf(BHUpgrade(1));
      power = power.add(Atom.electronCondenser());
      power = power.timesEffectsOf(
        AtomUpgrade(10),
        PhotonUpgrade[1],
        PrimordiumParticle.omega.effects[1],
        EntropyRewards.converter,
        NeutronUpgrade.bs5
      );
      power = power.powEffectOf(NeutronUpgrade.bh2);
      return power;
    },
    formatPower: value => formatX(value),
    effect($) {
      const power = $.power;
      const bought = $.boughtAmount;
      const free = $.freeAmount;
      return power.pow(
        bought.timesEffectOf(RadiationType.microwave.boosts[2])
          .add(free)
      );
    },
    formatEffect: value => i18n.t("condenser_effect", { value: formatX(value) }),
    upgClass: "i-condenser"
  },
  cosmicRay: {
    id: "cosmicRay",
    i18nKey: "cosmic_ray",
    get currency() {
      return Currency.atoms;
    },
    get baseCost() {
      return DC.D1;
    },
    get costMult() {
      return DC.D2;
    },
    get scaling() {
      return Scaling.cosmicRay;
    },
    get freeAmount() {
      return FermionType.quarks.fermions.up.reward.effectOrDefault(DC.D1)
        .timesEffectOf(EntropyRewards.booster);
    },
    cost(amount) {
      const cheap = FermionType.leptons.fermions.neutTau.reward.effectOrDefault(null);
      const $ = MassUpgrade.cosmicRay.config;
      return getLinearCost(
        $.scaling.scaleEvery(
          amount, false,
          [null, null, null, cheap]
        ),
        $.baseCost,
        $.costMult
      ).floor();
    },
    bulk(currency) {
      const cheap = FermionType.leptons.fermions.neutTau.reward.effectOrDefault(null);
      const $ = MassUpgrade.cosmicRay.config;
      return $.scaling.scaleEvery(
        getLinearBulk(currency, $.baseCost, $.costMult), true,
        [null, null, null, cheap]).add(1).floor();
    },
    get isUnlocked() {
      return PlayerProgress.atomUnlocked();
    },
    get autoUnlocked() {
      return GameElement(18).canBeApplied;
    },
    get power() {
      let power = DC.D2;
      power = power.plusEffectOf(AtomUpgrade(3));
      power = power.timesEffectsOf(
        AtomUpgrade(10),
        NeutronUpgrade.gr1,
        GluonUpgrade[1],
        PrimordiumParticle.sigma.effects[1],
        EntropyRewards.converter,
        NeutronUpgrade.bs5
      );
      power = power.powEffectOf(NeutronUpgrade.gr2);
      return power;
    },
    formatPower: value => formatX(value),
    effect($) {
      const power = $.power;
      const amount = $.totalAmount.timesEffectOf(RadiationType.visible.boosts[1]);
      return power.pow(amount).minus(1);
    },
    formatEffect: value => i18n.t("cosmic_ray_effect", { value: formatX(value) }),
    upgClass: "i-cosmic-ray"
  },
  starBooster: {
    id: "starBooster",
    i18nKey: "star_booster",
    get currency() {
      return Currency.quark;
    },
    get baseCost() {
      return DC.E8000;
    },
    get costMult() {
      return DC.E100;
    },
    get costPow() {
      return DC.D1_25;
    },
    cost(amount) {
      const $ = MassUpgrade.starBooster.config;
      return getLinearCost(
        amount.pow($.costPow),
        $.baseCost,
        $.costMult
      ).floor();
    },
    bulk(currency) {
      const $ = MassUpgrade.starBooster.config;
      return getLinearBulk(currency, $.baseCost, $.costMult).root($.costPow).add(1).floor();
    },
    get isUnlocked() {
      return NeutronUpgrade.s4.isBought;
    },
    get autoUnlocked() {
      return NeutronUpgrade.qol4.isBought;
    },
    get power() {
      let power = DC.D2;
      power = power.timesEffectOf(GameElement(57));
      power = Softcap.power(power, DC.E13, DC.D0_5);
      return power;
    },
    formatPower: value => formatX(value),
    effect($) {
      const power = $.power;
      const amount = $.totalAmount;
      let effect = power.pow(amount.timesEffectOf(Challenge(11).reward));
      effect = Softcap.dilation(effect, DC.E3E18, DC.D0_95);
      return effect;
    },
    formatEffect: value => i18n.t("star_booster_effect", { value: formatX(value) }),
    upgClass: "i-star-booster"
  },
  cosmicString: {
    id: "cosmicString",
    i18nKey: "cosmic_string",
    get currency() {
      return Currency.quantumFoam;
    },
    get baseCost() {
      return DC.D2;
    },
    get costMult() {
      return DC.D2;
    },
    get scaling() {
      return Scaling.cosmicString;
    },
    cost(amount) {
      const $ = MassUpgrade.cosmicString.config;
      return getLinearCost(
        $.scaling.scaleEvery(amount),
        $.baseCost,
        $.costMult
      ).floor();
    },
    bulk(currency) {
      const $ = MassUpgrade.cosmicString.config;
      return $.scaling.scaleEvery(getLinearBulk(currency, $.baseCost, $.costMult), true).add(1).floor();
    },
    get isUnlocked() {
      return PlayerProgress.quantumUnlocked();
    },
    get autoUnlocked() {
      return false;
    },
    get power() {
      let power = DC.D2;
      power = power.timesEffectOf(NeutronUpgrade.qu6);
      return power;
    },
    formatPower: value => formatX(value),
    effect($) {
      const power = $.power;
      const amount = $.totalAmount;
      return power.pow(amount);
    },
    formatEffect: value => i18n.t("cosmic_string_effect", { value: formatX(value) }),
    upgClass: "i-cosmic-string"
  }
};