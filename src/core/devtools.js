// eslint-disable no-console

export const dev = {};

dev.logMassMultipliers = function() {
  console.log(`Ranks: ${formatX(Effects.product(
    RankType.rank.unlocks.rankBoostsMass,
    RankType.rank.unlocks.tripleMassGain,
    RankType.rank.unlocks.massGain
  ))}`);
  console.log(`Tickspeed: ${formatX(MassUpgrade.tickspeed.effectValue)}`);
  console.log(`BH Upgrade 10: ${formatX(BHUpgrade(9).effectValue)}`);
  console.log(`Neutron Tree m1: ${formatX(NeutronUpgrade.m1.effectValue)}`);
  console.log(`Black Hole: ${formatX(BlackHole.mult)}`);
  console.log(`Proton: ${formatX(Atom.protonMass())}`);
  console.log(`Neutron: ${formatX(Atom.neutronMass())}`);
  console.log(`Collapsed Stars: ${formatX(Stars.boost)}`);
  console.log(`Tier: ${formatPow(RankType.tier.unlocks.raiseMassGain.effectValue)}`);
  console.log(`Rank: ${formatPow(RankType.rank.unlocks.massGainPower.effectValue)}`);
  console.log(`Challenge 3: ${formatPow(Challenge(3).reward.effectValue)}`);
  console.log(`Mass Dilation: exp${formatPow(MassDilation.power)}`);
  console.log(`Softcap 1: ${formatPow(MassSoftcap[0].effectValue)} at ${formatMass(MassSoftcap[0].mass)}`);
  console.log(`Softcap 2: ${formatPow(MassSoftcap[1].effectValue)} at ${formatMass(MassSoftcap[1].mass)}`);
};

dev.fixSave = function() {
  const save = JSON.stringify(player);
  const fixed = save.replace(/NaN/gui, "10");
  const saveData = JSON.parse(fixed);
  if (!saveData || GameStorage.checkPlayerObject(saveData) !== "") {
    Modal.message.show("Could not fix the save.");
    return;
  }
  GameStorage.importFromJSON(saveData);
  GameStorage.save();
};