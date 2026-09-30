import { DC } from "./constants";

export const BlackHole = {
  get mass() {
    return player.blackHole;
  },

  reset() {
    player.blackHole = DC.D0;
    MassUpgrade.condenser.reset();
    Currency.darkMatter.reset();
  },

  get exponent() {
    if (FermionType.leptons.fermions.neutrino.isEffectActive) {
      return DC.DM1;
    }
    return Effects.max(
      DC.D0_33,
      GameElement(59)
    ).plusEffectOf(RadiationType.microwave.boosts[1]);
  },

  get gain() {
    if (!this.isUnlocked) return DC.D0;
    let gain = Currency.blackHole.value.add(1).pow(this.exponent);
    gain = Softcap.dilation(
      gain,
      this.gainSoftcapStart,
      DC.D0_95.powEffectOf(NeutronUpgrade.qu3)
    );
    gain = gain.timesEffectsOf(
      MassUpgrade.condenser,
      RageUpgrade(10),
      BHUpgrade(13),
      GameElement(46),
      PhotonUpgrade[0]
    );
    gain = gain.powEffectsOf(
      Challenge(8),
      Challenge(8).reward,
      QuantumChallenge(4)
    );
    if (MassDilation.canBeApplied) {
      gain = dilatedValue(gain, MassDilation.power);
    }
    gain = Softcap.power(gain, this.softcapStart, DC.D0_5);
    gain = Softcap.power(gain, DC.EE28, DC.C1D3);
    return gain;
  },

  get isUnlocked() {
    return PlayerProgress.blackHoleUnlocked();
  },

  get mult() {
    if (!this.isUnlocked) return DC.D1;
    return this.mass.add(1).pow(AtomUpgrade(11).effectOrDefault(DC.D0_25));
  },

  get softcapStart() {
    return DC.D1_5E156.timesEffectOf(AtomUpgrade(5));
  },

  get gainSoftcapStart() {
    return DC.D1_5E3000000056.powEffectsOf(
      GameElement(71),
      RadiationType.gammaRay.boosts[2]
    );
  }
};