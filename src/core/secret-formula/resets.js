import { DC } from "@/core/constants";

export const resets = {
  rage: {
    canReset: () => Currency.mass.gte(DC.E15),
    requestReset(reset) {
      if (ConfirmationTypes.ragePower.option) {
        Modal.confirmation.show({
          option: "ragePower",
          confirmFn: reset
        });
      } else {
        reset();
      }
    },
    resetLayer(resetOnly) {
      if (!resetOnly) {
        Currency.ragePowers.gain();
      }
      const maxRank = RankType.all.last();
      maxRank.amount = DC.D0;
      maxRank.reset(true);
      Tutorial.ragePower.unlock();
      player.unlocks.ragePower = true;
    }
  },
  darkMatter: {
    canReset: () => Currency.ragePowers.gte(DC.E20),
    requestReset(reset) {
      if (ConfirmationTypes.darkMatter.option) {
        Modal.confirmation.show({
          option: "darkMatter",
          confirmFn: reset
        });
      } else {
        reset();
      }
    },
    resetLayer(resetOnly = false) {
      if (!resetOnly) {
        Currency.darkMatter.gain();
      }
      RageUpgrades.reset();
      MassUpgrade.tickspeed.reset();
      Currency.ragePowers.reset();
      Resets.rage.resetLayer(true);
      Currency.blackHole.reset();
      Tutorial.blackHole.unlock();
      player.unlocks.darkMatter = true;
    }
  },
  atom: {
    canReset: () => BlackHole.mass.gte(DC.D1_5E156),
    requestReset(reset) {
      if (ConfirmationTypes.atom.option) {
        Modal.confirmation.show({
          option: "atom",
          confirmFn: reset
        });
      } else {
        reset();
      }
    },
    resetLayer(resetOnly = false) {
      if (!resetOnly) {
        Currency.atoms.gain();
        Currency.quark.gain();
      }
      BlackHole.reset();
      BHUpgrades.reset();
      Currency.atomicPower.reset();
      Resets.darkMatter.resetLayer(true);
      Tutorial.atom.unlock();
      player.unlocks.atom = true;
      if (!AtomUpgrade(3).canBeApplied && !NeutronUpgrade.chal2.isBought) {
        for (let i = 1; i <= 4; i++) {
          Challenge(i).reset();
        }
        player.challenges.current = 0;
      }
    }
  },
  supernova: {
    canReset: () => Currency.stars.gte(Supernova.requirement),
    requestReset(reset) {
      if (ConfirmationTypes.supernova.option) {
        Modal.confirmation.show({
          option: "supernova",
          confirmFn: reset
        });
      } else {
        reset();
      }
    },
    resetLayer(resetOnly = false, forceReset = false) {
      if (!resetOnly) {
        Currency.supernova.gain();
      }
      if (!forceReset && NeutronUpgrade.quQol4.canBeApplied) return;
      Currency.atoms.reset();
      Currency.quark.reset();
      Particles.all.forEach(p => p.reset());
      Currency.atomicPower.reset();
      MassUpgrade.cosmicRay.reset();
      AtomUpgrades.reset();
      const keepElements = [21, 36];
      if (NeutronUpgrade.qol1.isBought) {
        keepElements.push(14, 18);
      }
      if (NeutronUpgrade.qol2.isBought) {
        keepElements.push(24);
      }
      if (NeutronUpgrade.qol3.isBought) {
        keepElements.push(43);
      }
      if (PlayerProgress.quantumUnlocked()) {
        keepElements.push(30);
      }
      if (NeutronUpgrade.quQol9.canBeApplied && QuantumChallenges.isActive) {
        keepElements.push(30);
      }
      for (const el of GameElements.all) {
        if (el.id <= 86 && !keepElements.includes(el.id)) {
          el.reset();
        }
      }
      MassDilation.isActive = false;
      Currency.relativisticParticles.reset();
      Currency.dilatedMass.reset();
      DilationUpgrade.all.forEach(du => du.reset());
      player.stars.unlocked = -1;
      StarGenerators.all.forEach(gen => gen.reset());
      Currency.stars.reset();
      MassUpgrade.starBooster.reset();
      Resets.atom.resetLayer(true);
      if (!NeutronUpgrade.chal3.isBought) {
        for (let i = 5; i <= 8; i++) {
          Challenge(i).reset();
        }
      }
      player.challenges.current = 0;
      player.supernova.fermions.active = -1;
      player.checks.supernova.noTick = true;
      player.checks.supernova.noCondenser = true;
      Tutorial.supernova.unlock();
    }
  },
  quantum: {
    canReset: () => Currency.mass.gte(Quantum.requirement),
    requestReset(reset) {
      if (ConfirmationTypes.quantum.option) {
        Modal.confirmation.show({
          option: "quantum",
          confirmFn: () => {
            setTimeout(() => Modal.quantum.show(), 100);
          },
          text: "Going Quantum will reset all previous except QoL mechanicals"
        });
      } else {
        reset();
      }
    },
    resetLayer(resetOnly = false, full = false) {
      if (!resetOnly) {
        Currency.quantumFoam.gain();
        Currency.quantizes.gain();
        if (QuantumChallenges.isActive) {
          QuantumChallenges.shards = QuantumChallenges.pendingShards.value;
        }
      }
      QuantumChallenges.isActive = false;
      const keepNodes = ["qol1", "qol2", "qol3", "qol4", "qol5", "qol6", "fn2", "fn5", "fn6", "fn7", "fn8", "fn9", "fn10", "fn11", "fn13"];
      if (QuantumMilestones.keepChallengeTree.canBeApplied) {
        keepNodes.push("chal1", "chal2", "chal3", "chal4", "chal4a", "chal5", "chal6", "chal7", "c", "qol7", "chal4b", "chal7a", "chal8");
      }
      if (QuantumMilestones.unlockRadiation.canBeApplied) {
        keepNodes.push("qol8", "qol9");
        if (!resetOnly) keepNodes.push("unl1");
      }
      const newSet = new Set();
      for (const node of player.supernova.tree) {
        if (keepNodes.includes(node) || NeutronUpgrade[node].quantum) {
          newSet.add(node);
        }
      }
      player.supernova.tree = newSet;
      for (const boson of Boson.all) {
        boson.amount = DC.D0;
      }
      const bosonUpgs = PhotonUpgrade.concat(GluonUpgrade);
      for (const upgrade of bosonUpgs) {
        upgrade.reset();
      }
      Currency.uQuarks.reset();
      Currency.uLeptons.reset();
      player.supernova.fermions.active = -1;
      if (!NeutronUpgrade.quQol2.canBeApplied || full) {
        for (const fermion of FermionType.quarks.fermions.all) {
          fermion.reset();
        }
      }
      if (!NeutronUpgrade.quQol6.canBeApplied || full) {
        for (const fermion of FermionType.leptons.fermions.all) {
          fermion.reset();
        }
      }
      Currency.frequency.reset();
      for (const radiation of RadiationType.all) {
        radiation.reset();
      }
      const resetChal = NeutronUpgrade.quQol7.canBeApplied && !full ? 8 : 12;
      for (let i = 1; i <= resetChal; i++) {
        Challenge(i).reset();
      }
      Resets.supernova.resetLayer(true, true);
      Currency.supernova.reset();
      Currency.neutronStars.reset();
      if (Currency.quantizes.value.eq(1)) {
        setTimeout(() => Modal.message.show("<img src='./images/qu_story1.png'><br><br>Mass has collapsed while going Quantum! It looks like evaporation! But at what cost?", {
          callback: () => {
            setTimeout(() => Modal.message.show("<img src='./images/qu_story2.png'><br><br>Don’t worry, new mechanics will arrive for you!", {
              callback: () => {
                setTimeout(() => Tutorial.quantum.unlock(), 100);
              },
              buttonText: "Cool"
            }), 100);
          },
          buttonText: "Uhh Oh"
        }), 100);
      }
      player.time.quantum = 0;
    }
  }
};