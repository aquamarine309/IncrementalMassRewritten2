import { DC } from "@/core/constants";

// Names: ["super", "hyper", "ultra", "meta", "exotic", "supercritical", "instant", "mega"]

export const scaling = {
  massUpgrade: {
    name: "Mass Upgrade",
    // Get the most amount of three upgrades
    currency: () => ["muscler", "booster", "stronger"].reduce((max, cur) => max.max(MassUpgrade[cur].boughtAmount), DC.D0),
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          if (Challenge(1).canBeApplied) return DC.D25;
          return DC.E2.plusEffectOf(BHUpgrade(2));
        },
        get scale() {
          return DC.D2_5.powEffectsOf(
            RageUpgrade(7),
            GameElement(84)
          );
        }
      },
      {
        get start() {
          return DC.D500;
        },
        get scale() {
          return DC.D5.powEffectsOf(
            RageUpgrade(7),
            GameElement(84)
          );
        }
      },
      {
        get start() {
          return DC.E11;
        },
        get scale() {
          return DC.E1;
        }
      }
    ]
  },
  tickspeed: {
    name: "Tickspeed",
    currency: () => MassUpgrade.tickspeed.boughtAmount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          if (Challenge(1).canBeApplied) return DC.D50;
          return DC.E2;
        },
        get scale() {
          let scale = DC.D2;
          scale = scale.powEffectOf(Challenge(1).reward.effects.tickspeed);
          return scale;
        }
      },
      {
        get start() {
          return DC.D250.plusEffectsOf(
            RageUpgrade(13),
            RankType.tetr.unlocks.tickScaling
          );
        },
        get scale() {
          return DC.D4.powEffectsOf(
            BHUpgrade(11),
            GameElement(27)
          );
        }
      },
      {
        get start() {
          return DC.D700.plusEffectOf(RankType.tetr.unlocks.tickScaling);
        },
        get scale() {
          return DC.D7.powEffectsOf(
            GameElement(27),
            GameElement(58)
          );
        }
      },
      {
        get start() {
          return DC.D5E4.timesEffectsOf(
            RankType.pent.unlocks.tickScale,
            GameElement(68),
            FermionType.quarks.fermions.bottom.reward,
            EntropyRewards.multiplier
          );
        },
        get scale() {
          return DC.D1_001;
        }
      },
    ]
  },
  rank: {
    name: "Rank",
    currency: () => RankType.rank.amount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          if (Challenge(1).canBeApplied) return DC.D25;
          let start = DC.D50;
          start = start.plusEffectOf(Challenge(1).reward.effects.rank);
          return start;
        },
        get scale() {
          return DC.D1_5.powEffectsOf(
            RageUpgrade(9),
            RankType.tetr.unlocks.ranksScaling
          );
        }
      },
      {
        get start() {
          return DC.D120.plusEffectOf(AtomUpgrade(9));
        },
        get scale() {
          return DC.D2_5.powEffectsOf(
            RankType.tetr.unlocks.ranksReqAndScaling.effects.rank,
            GameElement(27)
          );
        }
      },
      {
        get start() {
          return DC.D600.plusEffectOf(GameElement(62));
        },
        get scale() {
          return DC.D4.powEffectsOf(
            GameElement(27),
            GameElement(58)
          );
        }
      },
      {
        get start() {
          return DC.E4.timesEffectsOf(
            RankType.pent.unlocks.cheapTetrAndRank.effects.rank,
            RankType.pent.unlocks.rankScale,
            RadiationType.ultraviolet.boosts[2]
          );
        },
        get scale() {
          return DC.D1_0025;
        }
      },
      {
        get start() {
          return DC.E16;
        },
        get scale() {
          return DC.D15;
        }
      },
      {
        get start() {
          return DC.E37;
        },
        get scale() {
          return DC.D50;
        }
      },
    ]
  },
  tier: {
    name: "Tier",
    currency: () => RankType.tier.amount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          return DC.E1.plusEffectOf(AtomUpgrade(4));
        },
        get scale() {
          let scale = DC.D1_5;
          if (RankType.tetr.unlocks.ranksScaling.canBeApplied) {
            scale = scale.pow(0.8);
          }
          scale = scale.powEffectOf(GameElement(37));
          return scale;
        }
      },
      {
        get start() {
          return DC.D200;
        },
        get scale() {
          let scale = DC.D2_5;
          if (RankType.tetr.unlocks.ranksScaling.canBeApplied) {
            scale = scale.pow(0.8);
          }
          scale = scale.powEffectOf(GameElement(37));
          return scale;
        }
      },
      {
        get start() {
          return DC.E5;
        },
        get scale() {
          return DC.D4;
        }
      },
      {
        get start() {
          return DC.E9;
        },
        get scale() {
          return DC.C1P1EN7;
        }
      },
      {
        get start() {
          return DC.E25;
        },
        get scale() {
          return DC.D20;
        }
      },
      {
        get start() {
          return DC.E80;
        },
        get scale() {
          return DC.D50;
        }
      },
    ]
  },
  tetr: {
    name: "Tetr",
    currency: () => RankType.tetr.amount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          return DC.D7.plusEffectOf(RankType.tier.unlocks.superTetrLater);
        },
        get scale() {
          return DC.D2.powEffectOf(GameElement(74));
        }
      },
      {
        get start() {
          return DC.D60;
        },
        get scale() {
          return DC.D3;
        }
      },
      {
        get start() {
          return DC.D150;
        },
        get scale() {
          return DC.D6;
        }
      },
      {
        get start() {
          return DC.E10;
        },
        get scale() {
          return DC.C1P1EN8;
        }
      },
    ]
  },
  pent: {
    name: "Pent",
    currency: () => RankType.pent.amount,
    qcActive: true,
    scaling: [
      {
        get start() {
          return DC.D15;
        },
        get scale() {
          return DC.D2;
        }
      },
      {
        get start() {
          return DC.D60;
        },
        get scale() {
          return DC.D3;
        }
      },
      {
        get start() {
          return DC.D1200;
        },
        get scale() {
          return DC.D6;
        }
      },
    ]
  },
  overpower: {
    name: "Overpower",
    currency: () => MassUpgrade.overpower.boughtAmount,
    scaling: [
      {
        get start() {
          return DC.D50;
        },
        get scale() {
          return DC.D3;
        }
      }]
  },
  condenser: {
    name: "Condenser",
    currency: () => MassUpgrade.condenser.boughtAmount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          return DC.E2;
        },
        get scale() {
          return DC.D2.powEffectOf(GameElement(15));
        }
      },
      {
        get start() {
          return DC.D300;
        },
        get scale() {
          return DC.D2.powEffectOf(GameElement(55));
        }
      },
      {
        get start() {
          return DC.D750;
        },
        get scale() {
          return DC.D4.powEffectOf(GameElement(55));
        }
      },
      {
        get start() {
          return DC.E7.timesEffectOf(EntropyRewards.multiplier);
        },
        get scale() {
          return DC.D1_001;
        }
      },
    ]
  },
  cosmicRay: {
    name: "Cosmic Ray",
    currency: () => MassUpgrade.cosmicRay.boughtAmount,
    qcActive: true,
    preQuantum: true,
    scaling: [
      {
        get start() {
          return DC.E2;
        },
        get scale() {
          return DC.D2.powEffectOf(GameElement(15));
        }
      },
      {
        get start() {
          return DC.D300;
        },
        get scale() {
          return DC.D4.powEffectOf(GameElement(55));
        }
      },
      {
        get start() {
          return DC.D800;
        },
        get scale() {
          return DC.D6.powEffectOf(GameElement(55));
        }
      },
      {
        get start() {
          return DC.E6.timesEffectOf(EntropyRewards.multiplier);
        },
        get scale() {
          return DC.D1_001;
        }
      },
    ]
  },
  supernova: {
    name: "Supernova",
    currency: () => Currency.supernova.value,
    qcActive: true,
    scaling: [
      {
        get start() {
          return DC.D15.plusEffectOf(PrimordiumParticle.beta.effects[0]);
        },
        get scale() {
          return DC.D3.powEffectOf(FermionType.leptons.fermions.neutMeon.reward);
        }
      },
      {
        get start() {
          return DC.D35.plusEffectOf(PrimordiumParticle.beta.effects[0]);
        },
        get scale() {
          return DC.D3.powEffectOf(FermionType.leptons.fermions.neutMeon.reward);
        }
      },
      {
        get start() {
          return DC.D60.plusEffectOf(PrimordiumParticle.beta.effects[0]);
        },
        get scale() {
          return DC.D5.powEffectOf(FermionType.leptons.fermions.neutMeon.reward);
        }
      },
      {
        get start() {
          return DC.E2.plusEffectOf(PrimordiumParticle.beta.effects[0]);
        },
        get scale() {
          return DC.D1_025.powEffectOf(GameElement(78));
        }
      },
      {
        get start() {
          return DC.D2E5;
        },
        get scale() {
          return DC.D20;
        }
      },
      {
        get start() {
          return DC.E7;
        },
        get scale() {
          return DC.D75;
        }
      }
    ]
  },
  fermion: {
    name: "Fermion",
    currency: () => Fermions.all.reduce((max, cur) => max.max(cur.tier), DC.D0),
    qcActive: true,
    scaling: [
      {
        get start() {
          return DC.E1;
        },
        get scale() {
          return DC.D2_5.powEffectsOf(
            NeutronUpgrade.fn3,
            NeutronUpgrade.fn12
          );
        }
      },
      {
        get start() {
          return DC.D50;
        },
        get scale() {
          return DC.D4.powEffectOf(NeutronUpgrade.fn12);
        }
      },
      {
        get start() {
          return DC.E2;
        },
        get scale() {
          return DC.D6.powEffectOf(NeutronUpgrade.fn12);
        }
      },
      {
        get start() {
          return DC.D1_25E4;
        },
        get scale() {
          return DC.D1_001;
        }
      }
    ]
  },
  cosmicString: {
    name: "Cosmic String",
    currency: () => MassUpgrade.cosmicString.boughtAmount,
    scaling: [
      {
        get start() {
          return DC.D15;
        },
        get scale() {
          return DC.D2;
        }
      },
      {
        get start() {
          return DC.D90;
        },
        get scale() {
          return DC.D4;
        }
      }
    ]
  }
};
