import { DC } from "@/core/constants";

export const bosons = {
  positiveW: {
    id: "positiveW",
    gain: () => DC.D0_01.timesEffectsOf(
      Boson.negativeW.effects.positiveW,
      Boson.zBoson.effects.wBosons,
      Boson.graviton
    ).powEffectOf(QuantumChallenge(3)),
    effects: {
      mass: value => {
        let effect = value.add(1).pow(DC.D2E4);
        if (NeutronUpgrade.qu2.canBeApplied) {
          effect = effect.pow(Softcap.power(value.add(1).log10().add(1).pow(DC.C4D3), DC.E15, DC.D0_1));
        }
        return overflow(effect, DC.EE2500, DC.D0_25);
      },
      negativeW: value => dilatedValue(value.add(1), DC.C2D3, DC.D2)
    }
  },
  negativeW: {
    id: "negativeW",
    gain: () => DC.D0_01.timesEffectsOf(
      Boson.positiveW.effects.negativeW,
      Boson.zBoson.effects.wBosons,
      Boson.graviton
    ).powEffectOf(QuantumChallenge(3)),
    effects: {
      softcap: value => value.add(1).log10().add(1).pow(DC.C1D3),
      positiveW: value => dilatedValue(value.add(1), DC.D0_75, DC.D2)
    }
  },
  zBoson: {
    id: "zBoson",
    gain: () => DC.D0_01
      .timesEffectOf(Boson.graviton)
      .powEffectsOf(
        NeutronUpgrade.bs4,
        QuantumChallenge(3)
      ),
    effects: {
      tickspeed: value => (FermionType.leptons.fermions.neutMeon.canBeApplied
        ? DC.D1
        : value.add(1).log10().add(1).powEffectOf(FermionType.quarks.fermions.charm.reward)),
      wBosons: value => value.add(1).pow(DC.C2D3)
    }
  },
  photon: {
    id: "photon",
    gain: () => DC.D0_01.timesEffectsOf(
      Boson.graviton,
      PhotonUpgrade[2],
      NeutronUpgrade.bs2.effects.photon
    ).powEffectOf(QuantumChallenge(3))
  },
  gluon: {
    id: "gluon",
    gain: () => DC.D0_01.timesEffectsOf(
      Boson.graviton,
      GluonUpgrade[2],
      NeutronUpgrade.bs2.effects.gluon
    )
  },
  graviton: {
    id: "graviton",
    gain: () => DC.D0_01.timesEffectsOf(
      Boson.graviton,
      FermionType.leptons.fermions.meon.reward
    ).powEffectOf(QuantumChallenge(3)),
    effect: value => dilatedValue(value, DC.D0_5).powEffectOf(Boson.higgsBoson).clampMin(1)
  },
  higgsBoson: {
    id: "higgsBoson",
    gain: () => DC.D0_01.timesEffectsOf(
      NeutronUpgrade.bs1,
      FermionType.leptons.fermions.meon.reward
    ).powEffectOf(QuantumChallenge(3)),
    effect: value => value.add(1).log10().max(1).sqrt()
      .timesEffectOf(PrimordiumParticle.phi.effects[0])
  }
};

export const bosonUpgrades = {
  photon: [
    {
      id: 0,
      description: () => i18n.t("boson_photon_upgrade_0_description"),
      cost: value => DC.D1_5.pow(value.pow(DC.D1_25)).times(DC.E1),
      bulk: value => value.div(DC.E1).log(DC.D1_5).pow(DC.D0_8).add(1).floor(),
      effect: value => Boson.photon.amount.add(1)
        .pow(value.timesEffectOf(RadiationType.infrared.boosts[1])
          .pow(DC.D0_8).times(DC.E2)),
      formatEffect: value => formatX(value)
    },
    {
      id: 1,
      description: () => i18n.t("boson_photon_upgrade_1_description"),
      cost: value => DC.D2.pow(value.pow(DC.D1_25)).times(DC.E2),
      bulk: value => value.div(DC.E2).log(DC.D2).pow(DC.D0_8).add(1).floor(),
      effect: value => value.add(1).pow(DC.D0_75).powEffectOf(NeutronUpgrade.fn4),
      formatEffect: value => formatX(value)
    },
    {
      id: 2,
      description: () => i18n.t("boson_photon_upgrade_2_description"),
      cost: value => DC.D5.pow(value.pow(DC.D1_25)).times(DC.D500),
      bulk: value => value.div(DC.D500).log(DC.D5).pow(DC.D0_8).add(1).floor(),
      effect: value => Softcap.power(Currency.stars.value.add(1).log10().add(1).pow(value.times(DC.D0_2)), DC.E15, DC.D0_6),
      formatEffect: value => formatX(value),
      softcapped: value => value.gte(DC.E15)
    },
    {
      id: 3,
      description: () => i18n.t("boson_photon_upgrade_3_description"),
      cost: value => DC.D5.pow(value.pow(DC.D1_25)).times(DC.E5),
      bulk: value => value.div(DC.E5).log(DC.D5).pow(DC.D0_8).add(1).floor(),
      effect: value => {
        let effect = Boson.photon.amount.add(1).log10().add(1).pow(Softcap.power(value, DC.D8000, DC.D0_1).powEffectOf(
          FermionType.quarks.fermions.strange.reward).times(DC.D0_5));
        effect = Softcap.dilation(effect, DC.EE11, DC.D0_8);
        const el99 = GameElement(99).isBought;
        effect = Softcap.dilation(effect, DC.E4E14, el99 ? DC.D0_785 : DC.D0_75);
        if (!el99) {
          effect = Softcap.dilation(effect, DC.E4E15, DC.D0_5);
        }
        return effect;
      },
      formatEffect: value => formatX(value),
      softcapped: value => PhotonUpgrade[3].boughtAmount.gte(DC.D8000) || value.gte(DC.EE11)
    }
  ],
  gluon: [
    {
      id: 0,
      description: () => i18n.t("boson_gluon_upgrade_0_description"),
      cost: value => DC.D1_5.pow(value.pow(DC.D1_25)).times(DC.E1),
      bulk: value => value.div(DC.E1).log(DC.D1_5).pow(DC.D0_8).add(1).floor(),
      effect: value => Boson.gluon.amount.add(1)
        .pow(value.timesEffectOf(RadiationType.infrared.boosts[1])
          .pow(DC.D0_8).times(DC.E2)),
      formatEffect: value => formatX(value)
    },
    {
      id: 1,
      description: () => i18n.t("boson_gluon_upgrade_1_description"),
      cost: value => DC.D2.pow(value.pow(DC.D1_25)).times(DC.E2),
      bulk: value => value.div(DC.E2).log(DC.D2).pow(DC.D0_8).add(1).floor(),
      effect: value => value.add(1).pow(DC.D0_75).powEffectOf(NeutronUpgrade.fn4),
      formatEffect: value => formatX(value)
    },
    {
      id: 2,
      description: () => i18n.t("boson_gluon_upgrade_2_description"),
      cost: value => DC.D5.pow(value.pow(DC.D1_25)).times(DC.D500),
      bulk: value => value.div(DC.D500).log(DC.D5).pow(DC.D0_8).add(1).floor(),
      effect: value => Softcap.power(Currency.quark.value.add(1).log10().add(1).pow(value.times(DC.D0_125)), DC.E15, DC.D0_6),
      formatEffect: value => formatX(value),
      softcapped: value => value.gte(DC.E15)
    },
    {
      id: 3,
      description: () => i18n.t("boson_gluon_upgrade_3_description"),
      cost: value => DC.D5.pow(value.pow(DC.D1_25)).times(DC.E5),
      bulk: value => value.div(DC.E5).log(DC.D5).pow(DC.D0_8).add(1).floor(),
      effect: value => {
        let effect = Boson.gluon.amount.add(1).log10().add(1).log10()
          .times(value.pow(DC.C1D3.timesEffectOf(
            FermionType.quarks.fermions.strange.reward)
          )).div(DC.E1).add(1);
        effect = Softcap.power(Softcap.power(effect, DC.D5_5, DC.D0_25), DC.E1, DC.D0_25);
        return effect;
      },
      formatEffect: value => formatDiv(value),
      softcapped: value => value.gte(DC.D5_5)
    }
  ]
};