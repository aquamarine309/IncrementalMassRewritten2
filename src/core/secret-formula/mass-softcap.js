import { DC } from "@/core/constants";
import { mlt } from "@/core/math";

export const massSoftcap = [
  {
    id: 0,
    mass() {
      let mass = DC.E156;
      mass = mass.dividedByEffectsOf(
        Challenge(3),
        Challenge(4)
      );
      mass = mass.timesEffectsOf(
        BHUpgrade(6),
        RageUpgrade(12)
      );
      return mass;
    },
    effect() {
      let div = DC.C1D3;
      if (Challenge(3).canBeApplied) {
        div = div.times(4);
      }
      div = div.timesEffectsOf(
        BHUpgrade(10),
        Challenge(7),
        RankType.rank.unlocks.massSoftcap
      );
      return div.add(1).recip();
    }
  },
  {
    id: 1,
    mass() {
      return DC.D1_5E1000056.powEffectsOf(
        RankType.tetr.unlocks.softcapLater,
        NeutronUpgrade.m2,
        Boson.negativeW.effects.softcap
      );
    },
    effect() {
      return DC.D0_25.powEffectOf(GameElement(51));
    }
  },
  {
    id: 2,
    mass() {
      return DC.D1_5E100000056.powEffectsOf(
        NeutronUpgrade.m3,
        RadiationType.radio.boosts[2]
      );
    },
    effect() {
      return DC.D0_2.powEffectOf(GameElement(77));
    }
  },
  {
    id: 3,
    mass() {
      return mlt(DC.E4).powEffectsOf(
        RankType.pent.unlocks.massSoftcapLater,
        NeutronUpgrade.qc1
      );
    },
    effect() {
      return DC.D0_1;
    }
  },
  {
    id: 4,
    mass() {
      return mlt(DC.E12);
    },
    effect() {
      return DC.D0_05;
    }
  }
];