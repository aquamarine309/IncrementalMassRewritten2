import { DC } from "@/core/constants";
import Decimal from "break_eternity.js";
import { mlt, uni } from "@/core/math";

const bs2Effect = x => overflow(
  dilatedValue(x, GameElement(113).effectOrDefault(DC.D0_5), DC.D2).max(1),
  DC.EE60, DC.D0_5
);

export const neutronTrees = [
  {
    id: 0,
    key: "neutron_tree_main",
    isUnlocked: () => true,
    layout: [
      ["c"],
      ["s1", "m1", "rp1", "bh1", "sn1"],
      ["s2", "m2", "t1", "d1", "bh2", "gr1", "sn2"],
      ["s3", "m3", "gr2", "sn3"],
      ["s4", "sn5", "sn4"]
    ]
  },
  {
    id: 1,
    key: "neutron_tree_qol",
    isUnlocked: () => true,
    layout: [
      ["qol1", null, null, null, "quQol1", null],
      ["qol2", "qol3", "qol4", "quQol2", "quQol3", "quQol4", "quQol5", "quQol6"],
      ["qol5", "qol6", "qol7", null, null, "quQol7", null, null],
      ["qol9", "unl1", "qol8", "unl2", "unl3", "quQol8", "quQol9", "unl4"]
    ]
  },
  {
    id: 2,
    key: "neutron_tree_challenge",
    isUnlocked: () => true,
    layout: [
      ["chal1"],
      ["chal2", "chal4a", "chal4b", "chal3"],
      ["chal4", "chal7a"],
      ["chal5", "chal6", "chal7", null]
    ]
  },
  {
    id: 3,
    key: "neutron_tree_post_supernova",
    isUnlocked: () => Bosons.areUnlocked,
    layout: [
      ["bs4", "bs1", null, "qf1", null, "rad1"],
      ["bs5", "bs2", "fn1", "bs3", "qf2", "qf3", "rad2", "rad3"],
      ["fn4", "fn3", "fn9", "fn2", "fn5", "qf4", "rad4", "rad5"],
      ["fn12", "fn11", "fn6", "fn10", "rad6", null],
      [null, "fn7", "fn8", null]
    ]
  },
  {
    id: 4,
    key: "quantum",
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    layout: [
      ["qu0"],
      ["qu1", "qu2", "qu3"],
      ["prim3", "prim2", "prim1", "qu4", "qc1", "qc2", null],
      [null, "qu5", null],
      ["qu6", "qu7", "qu8", "qu9", null, null]
    ]
  }
];

export const neutronUpgrades = {
  c: {
    id: "c",
    branch: [],
    description: () => i18n.t("neutron_upgrade_c_description", { value: format(0.1, 1) }),
    effect: DC.D0_1,
    requirement: () => i18n.t("X_supernova", { value: formatInt(1) }),
    check: () => Currency.supernova.gte(1),
    cost: DC.D0
  },
  s1: {
    id: "s1",
    branch: ["c"],
    description: () => i18n.t("neutron_upgrade_s1_description"),
    effect: () => Currency.neutronStars.value.add(1).pow(1.4),
    formatEffect: value => formatX(value),
    cost: DC.D400
  },
  s2: {
    id: "s2",
    branch: ["s1"],
    description: () => i18n.t("neutron_upgrade_s2_description", { value: formatPercents(0.5, 0) }),
    effect: DC.C2D3,
    requirement: () => i18n.t("X_supernova", { value: formatInt(3) }),
    check: () => Currency.supernova.gte(3),
    cost: DC.D2500
  },
  s3: {
    id: "s3",
    branch: ["s2"],
    description: () => i18n.t("neutron_upgrade_s3_description"),
    effect: () => Currency.supernova.value.pow(0.1).times(0.1).add(1),
    formatEffect: value => formatPow(value),
    requirement: () => i18n.t("X_supernova", { value: formatInt(4) }),
    check: () => Currency.supernova.gte(4),
    cost: DC.E4
  },
  s4: {
    id: "s4",
    branch: ["s3"],
    description: () => i18n.t("neutron_upgrade_s4_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(6) }),
    check: () => Currency.supernova.gte(6),
    cost: DC.E5
  },
  m1: {
    id: "m1",
    branch: ["c"],
    description: () => i18n.t("neutron_upgrade_m1_description"),
    effect: () => Decimal.pow10(Softcap.power(Currency.neutronStars.value.add(1).log10().pow(5), DC.E3, DC.D0_25).times(DC.E2)),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(DC.EE5),
    cost: DC.E2
  },
  m2: {
    id: "m2",
    branch: ["m1"],
    description: () => i18n.t("neutron_upgrade_m2_description", {
      value1: formatInt(2),
      value2: format(DC.D1_5, 1)
    }),
    effect: () => DC.D1_5.times(Supernova.times.times(0.0125).add(1)),
    formatEffect: value => i18n.t("X_later", { value: formatPow(value) }),
    cost: DC.D800
  },
  m3: {
    id: "m3",
    branch: ["m2"],
    isUnlocked: () => Fermions.areUnlocked,
    description: () => i18n.t("neutron_upgrade_m3_description", { value: formatInt(3) }),
    effect: () => Supernova.times.times(0.0125).add(1),
    formatEffect: value => i18n.t("X_later", { value: formatPow(value) }),
    cost: DC.E46
  },
  rp1: {
    id: "rp1",
    branch: ["c"],
    description: () => i18n.t("neutron_upgrade_rp1_description"),
    effect: () => Decimal.pow10(Softcap.power(Currency.neutronStars.value.add(1).log10().pow(5), DC.E3, DC.D0_25).times(DC.D50)),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(DC.E5E4),
    cost: DC.D200
  },
  bh1: {
    id: "bh1",
    branch: ["c"],
    description: () => i18n.t("neutron_upgrade_bh1_description"),
    effect: () => Decimal.pow10(Softcap.power(Currency.neutronStars.value.add(1).log10().pow(5), DC.E3, DC.D0_25).times(DC.D35)),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(DC.E3_5E4),
    cost: DC.D400
  },
  bh2: {
    id: "bh2",
    branch: ["bh1"],
    description: () => i18n.t("neutron_upgrade_bh2_description", { value: format(1.15, 2) }),
    effect: 1.15,
    requirement: () => i18n.t("neutron_upgrade_bh2_requirement", { value: formatMass(DC.D1_5E1_7556E4) }),
    check: () => player.checks.supernova.noCondenser && Currency.blackHole.gte(DC.D1_5E1_7556E4),
    cost: DC.D1500
  },
  sn1: {
    id: "sn1",
    branch: ["c"],
    description: () => i18n.t("neutron_upgrade_sn1_description"),
    effect: () => MassUpgrade.tickspeed.boughtAmount.add(1).pow(0.25),
    formatEffect: value => formatX(value),
    cost: DC.E1
  },
  sn2: {
    id: "sn2",
    branch: ["sn1"],
    description: () => i18n.t("neutron_upgrade_sn2_description"),
    effect: () => {
      let supernova = Currency.supernova.value;
      if (!NeutronUpgrade.qu4.canBeApplied) {
        supernova = Softcap.power(supernova, 15, 0.8);
        supernova = Softcap.power(supernova, 25, 0.5);
      }
      return DC.D2.plusEffectOf(NeutronUpgrade.sn4).pow(supernova);
    },
    formatEffect: value => formatX(value),
    cost: DC.D350
  },
  sn3: {
    id: "sn3",
    branch: ["sn2"],
    description: () => i18n.t("neutron_upgrade_sn3_description"),
    effect: () => StarGenerator(4).amount.max(1).log10().add(1),
    formatEffect: value => formatX(value),
    requirement: () => i18n.t("X_supernova", { value: formatInt(6) }),
    check: () => Currency.supernova.gte(6),
    cost: DC.D5E4
  },
  sn4: {
    id: "sn4",
    branch: ["sn3"],
    isUnlocked: () => Bosons.areUnlocked,
    description: () => i18n.t("neutron_upgrade_sn4_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(13) }),
    check: () => Currency.supernova.gte(13),
    effect: () => Softcap.power(Supernova.times.times(0.1), DC.D1_5, DC.D0_75),
    formatEffect: value => formatPlus(value),
    softcapped: value => value.gte(DC.D1_5),
    cost: DC.E8
  },
  sn5: {
    id: "sn5",
    branch: ["sn4"],
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    description: () => i18n.t("neutron_upgrade_sn5_description"),
    effect: () => Currency.mass.value.add(1).log10().add(1).pow(2),
    formatEffect: value => formatX(value),
    cost: DC.E450
  },
  t1: {
    id: "t1",
    branch: ["m1", "rp1"],
    description: () => i18n.t("neutron_upgrade_t1_description", { value: format(1.15, 2) }),
    effect: 1.15,
    requirement: () => i18n.t("neutron_upgrade_t1_requirement", { value: formatMass(DC.D1_5E1_65E6) }),
    check: () => player.checks.supernova.noTick && Currency.mass.gte(DC.D1_5E1_65E6),
    cost: DC.D1500
  },
  d1: {
    id: "d1",
    branch: ["rp1"],
    isUnlocked: () => NeutronUpgrade.fn6.isBought,
    description: () => i18n.t("neutron_upgrade_d1_description", { value: formatPercents(0.25, 0) }),
    effect: DC.D1_25,
    effectCondition: () => !MassDilation.isActive,
    cost: DC.E51
  },
  gr1: {
    id: "gr1",
    branch: ["bh1"],
    description: () => i18n.t("neutron_upgrade_gr1_description"),
    effect: () => MassUpgrade.condenser.power.max(1).root(3),
    formatEffect: value => formatX(value),
    requirement: () => i18n.t("X_supernova", { value: formatInt(7) }),
    check: () => Currency.supernova.gte(7),
    cost: DC.E6
  },
  gr2: {
    id: "gr2",
    branch: ["gr1"],
    isUnlocked: () => Fermions.areUnlocked,
    description: () => i18n.t("neutron_upgrade_gr2_description", { value: format(DC.D1_25, 2) }),
    effect: DC.D1_25,
    cost: DC.E20
  },
  qol1: {
    id: "qol1",
    branch: [],
    description: () => i18n.t("neutron_upgrade_qol1_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(2) }),
    check: () => Currency.supernova.gte(2),
    cost: DC.D2500,
    onPurchased() {
      GameElement(14).isBought = true;
      GameElement(18).isBought = true;
    }
  },
  qol2: {
    id: "qol2",
    branch: ["qol1"],
    description: () => i18n.t("neutron_upgrade_qol2_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(3) }),
    check: () => Currency.supernova.gte(3),
    cost: DC.D2000,
    onPurchased() {
      GameElement(24).isBought = true;
      AtomUpgrade(5).isBought = true;
    }
  },
  qol3: {
    id: "qol3",
    branch: ["qol2"],
    description: () => i18n.t("neutron_upgrade_qol3_description"),
    effect: () => MassDilation.particleGainAt(dilatedValue(Currency.mass.value, MassDilation.power)),
    formatEffect: value => i18n.t("neutron_upgrade_qol3_effect", { value: format(value), sec: i18n.t("sec") }),
    requirement: () => i18n.t("X_supernova", { value: formatInt(4) }),
    check: () => Currency.supernova.gte(4),
    cost: DC.E4,
    onPurchased() {
      GameElement(43).isBought = true;
    },
    effectCondition: () => !MassDilation.isActive
  },
  qol4: {
    id: "qol4",
    branch: ["qol3"],
    isUnlocked: () => Bosons.areUnlocked,
    description: () => i18n.t("neutron_upgrade_qol4_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(12) }),
    check: () => Currency.supernova.gte(12),
    cost: DC.E8
  },
  qol5: {
    id: "qol5",
    branch: ["qol4"],
    description: () => i18n.t("neutron_upgrade_qol5_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(16) }),
    check: () => Currency.supernova.gte(16),
    cost: DC.E13
  },
  qol6: {
    id: "qol6",
    branch: ["qol5"],
    description: () => i18n.t("neutron_upgrade_qol6_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(17) }),
    check: () => Currency.supernova.gte(17),
    cost: DC.E15
  },
  qol7: {
    id: "qol7",
    branch: ["qol6"],
    isUnlocked: () => Fermions.areUnlocked && NeutronUpgrade.fn2.isBought || PlayerProgress.quantumUnlocked(),
    description: () => i18n.t("neutron_upgrade_qol7_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(40) }),
    check: () => Currency.supernova.gte(40),
    cost: DC.E48
  },
  qol8: {
    id: "qol8",
    branch: ["unl1"],
    description: () => i18n.t("neutron_upgrade_qol8_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(60) }),
    check: () => Currency.supernova.gte(60),
    cost: DC.E78
  },
  qol9: {
    id: "qol9",
    branch: ["unl1"],
    description: () => i18n.t("neutron_upgrade_qol9_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(78) }),
    check: () => Currency.supernova.gte(78),
    cost: DC.E111
  },
  unl1: {
    id: "unl1",
    branch: ["qol7"],
    description: () => i18n.t("neutron_upgrade_unl1_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(44) }),
    check: () => Currency.supernova.gte(44),
    cost: DC.E52,
    onPurchased() {
      Tutorial.radiation.unlock();
    }
  },
  unl2: {
    id: "unl2",
    branch: ["quQol7"],
    requirement: () => i18n.t("X_quantum_shards", { value: formatInt(20) }),
    check: () => Currency.quantizes.gte(DC.D20),
    description: () => i18n.t("neutron_upgrade_unl2_description"),
    cost: DC.D50,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  unl3: {
    id: "unl3",
    branch: ["unl2"],
    requirement: () => i18n.t("quantize_X_times", { value: formatInt(200) }),
    check: () => Currency.quantizes.gte(DC.D200),
    description: () => i18n.t("neutron_upgrade_unl3_description"),
    cost: DC.E6,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  unl4: {
    id: "unl4",
    branch: ["quQol9"],
    requirement: () => i18n.t("X_quantum_shards", { value: formatInt(66) }),
    check: () => QuantumChallenges.shards >= 66,
    description: () => i18n.t("neutron_upgrade_unl4_description"),
    cost: DC.E42,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol1: {
    id: "quQol1",
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    branch: [],
    description: () => i18n.t("neutron_upgrade_quQol1_description"),
    cost: DC.D3,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol2: {
    id: "quQol2",
    branch: ["quQol1"],
    requirement: () => i18n.t("neutron_upgrade_quQol2_requirement", { value: formatInt(81) }),
    check: () => Currency.supernova.gte(81) && FermionType.quarks.fermions.all.every(x => x.tier.eq(0)),
    description: () => i18n.t("neutron_upgrade_quQol2_description"),
    cost: DC.D4,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol3: {
    id: "quQol3",
    branch: ["quQol1"],
    requirement: () => i18n.t("neutron_upgrade_quQol3_requirement", { value: formatMass(mlt(DC.E4)) }),
    check: () => Currency.mass.gte(mlt(DC.E4)) && [1, 2, 3, 4].every(x => Challenge(x).completions.eq(0)),
    description: () => i18n.t("neutron_upgrade_quQol3_description"),
    cost: DC.D4,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol4: {
    id: "quQol4",
    branch: ["quQol1"],
    description: () => i18n.t("neutron_upgrade_quQol4_description"),
    cost: DC.D4,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol5: {
    id: "quQol5",
    branch: ["quQol1"],
    requirement: () => i18n.t("neutron_upgrade_quQol5_requirement", { value: formatMass(mlt(DC.D1_35E4)) }),
    check: () => Currency.mass.gte(mlt(DC.D1_35E4)) && [5, 6, 8].every(x => Challenge(x).completions.eq(0)),
    description: () => i18n.t("neutron_upgrade_quQol5_description"),
    cost: DC.D4,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol6: {
    id: "quQol6",
    branch: ["quQol1"],
    requirement: () => i18n.t("neutron_upgrade_quQol6_requirement", { value: formatInt(42) }),
    check: () => Currency.supernova.gte(42) && FermionType.leptons.fermions.all.every(x => x.tier.eq(0)),
    description: () => i18n.t("neutron_upgrade_quQol6_description"),
    cost: DC.D4,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol7: {
    id: "quQol7",
    branch: ["quQol3", "quQol5"],
    requirement: () => i18n.t("neutron_upgrade_quQol7_requirement", { value: formatMass(mlt(DC.D5000)) }),
    check: () => Currency.mass.gte(mlt(DC.D5000)) && [9, 10, 11, 12].every(x => Challenge(x).completions.eq(0)) && FermionType.quarks.fermions.bottom.isActive,
    description: () => i18n.t("neutron_upgrade_quQol7_description"),
    cost: DC.D25,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol8: {
    id: "quQol8",
    branch: ["unl3"],
    requirement: () => i18n.t("X_quantum_shards", { value: formatInt(15) }),
    check: () => QuantumChallenges.shards >= 15,
    description: () => i18n.t("neutron_upgrade_quQol8_description"),
    effectCondition: () => !QuantumChallenges.isActive,
    cost: DC.E11,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  quQol9: {
    id: "quQol9",
    branch: ["quQol8"],
    requirement: () => i18n.t("X_quantum_shards", { value: formatInt(24) }),
    check: () => QuantumChallenges.shards >= 24,
    description: () => i18n.t("neutron_upgrade_quQol9_description"),
    cost: DC.E17,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  chal1: {
    id: "chal1",
    branch: [],
    description: () => i18n.t("neutron_upgrade_chal1_description", { value: formatInt(100) }),
    effect: DC.E2,
    requirement: () => i18n.t("X_supernova", { value: formatInt(4) }),
    check: () => Currency.supernova.gte(4),
    cost: DC.D6000
  },
  chal2: {
    id: "chal2",
    branch: ["chal1"],
    description: () => i18n.t("neutron_upgrade_chal2_description"),
    requirement: () => i18n.t("neutron_upgrade_chal2_requirement", { value: formatMass(DC.E2_05E6) }),
    check: () => Currency.mass.gte(DC.E2_05E6) && Challenges.all.slice(0, 4).every(chal => chal.completions.eq(0)),
    cost: DC.E4
  },
  chal3: {
    id: "chal3",
    branch: ["chal1"],
    description: () => i18n.t("neutron_upgrade_chal3_description"),
    requirement: () => i18n.t("neutron_upgrade_chal3_requirement", { value: formatMass(DC.E1_75E4) }),
    check: () => Currency.blackHole.gte(DC.E1_75E4) && Challenges.all.slice(4, 8).every(chal => chal.completions.eq(0)),
    cost: DC.E4
  },
  chal4: {
    id: "chal4",
    branch: ["chal2", "chal3"],
    description: () => i18n.t("neutron_upgrade_chal4_description"),
    cost: DC.D1_5E4
  },
  chal4a: {
    id: "chal4a",
    branch: ["chal4"],
    isUnlocked: () => Bosons.areUnlocked,
    description: () => i18n.t("neutron_upgrade_chal4a_description"),
    effect: DC.C2D7,
    cost: DC.E8
  },
  chal4b: {
    id: "chal4b",
    branch: ["chal4"],
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    description: () => i18n.t("neutron_upgrade_chal4b_description", { value: formatInt(100) }),
    effect: DC.E2,
    cost: DC.E480
  },
  chal5: {
    id: "chal5",
    branch: ["chal4"],
    description: () => i18n.t("neutron_upgrade_chal5_description"),
    cost: DC.E17
  },
  chal6: {
    id: "chal6",
    branch: ["chal5"],
    isUnlocked: () => Radiation.isUnlocked,
    description: () => i18n.t("neutron_upgrade_chal6_description"),
    cost: DC.E88
  },
  chal7: {
    id: "chal7",
    branch: ["chal6"],
    description: () => i18n.t("neutron_upgrade_chal7_description"),
    cost: DC.E200
  },
  chal7a: {
    id: "chal7a",
    isUnlocked: () => QuantumChallenges.areUnlocked,
    branch: ["chal7"],
    description: () => i18n.t("neutron_upgrade_chal7a_description"),
    effect: DC.C2D3,
    cost: DC.E900
  },
  bs1: {
    id: "bs1",
    branch: [],
    isUnlocked: () => Bosons.areUnlocked,
    description: () => i18n.t("neutron_upgrade_bs1_description"),
    requirement: () => i18n.t("X_supernova", { value: formatInt(15) }),
    check: () => Currency.supernova.gte(15),
    effect: () => MassUpgrade.tickspeed.boughtAmount.add(1).pow(0.6),
    formatEffect: value => formatX(value),
    cost: DC.E13
  },
  bs2: {
    id: "bs2",
    branch: ["bs1"],
    description: () => i18n.t("neutron_upgrade_bs2_description"),
    effects: {
      photon: () => bs2Effect(Boson.photon.amount),
      gluon: () => bs2Effect(Boson.gluon.amount)
    },
    formatEffect: effects => i18n.t("neutron_upgrade_bs2_effect", {
      photon: formatX(effects.photon),
      gluon: formatX(effects.gluon)
    }),
    cost: DC.E14
  },
  bs3: {
    id: "bs3",
    branch: ["bs1"],
    description: () => i18n.t("neutron_upgrade_bs3_description"),
    effect: () => Softcap.dilation(Softcap.power(Boson.graviton.effectValue.add(1).sqrt(), DC.E1000, DC.C1D3), DC.EE38, DC.D0_95),
    formatEffect: value => formatX(value),
    softcapped: value => value.gte(DC.E1000),
    cost: DC.E14
  },
  bs4: {
    id: "bs4",
    branch: ["bs2"],
    isUnlocked: () => Fermions.areUnlocked,
    description: () => i18n.t("neutron_upgrade_bs4_description", { value: format(DC.D1_5, 1) }),
    effect: DC.D1_5,
    cost: DC.E24
  },
  bs5: {
    id: "bs5",
    branch: ["bs4"],
    isUnlocked: () => Entropy.isUnlocked,
    description: "Z Bosons also affect Condenser and Cosmic Ray's powers.",
    effect: () => Boson.zBoson.effects.tickspeed.effectValue,
    formatEffect: value => formatX(value),
    cost: DC.E1100
  },
  fn1: {
    id: "fn1",
    branch: ["bs1"],
    isUnlocked: () => Fermions.areUnlocked,
    description: () => i18n.t("neutron_upgrade_fn1_description"),
    effect: () => DC.D1_25.pow(Softcap.dilation(MassUpgrade.tickspeed.boughtAmount, DC.E24, DC.D0_5).pow(DC.D0_4)),
    formatEffect: value => formatX(value),
    cost: DC.E27
  },
  fn2: {
    id: "fn2",
    branch: ["fn1"],
    description: () => i18n.t("neutron_upgrade_fn2_description"),
    requirement: () => i18n.t("neutron_upgrade_fn2_requirement", { value: formatMass(DC.D1_5E1000056) }),
    check: () => (FermionType.quarks.fermions.down.isActive &&
      MassDilation.isActive &&
      Currency.mass.gte(DC.D1_5E1000056)
    ),
    cost: DC.E33
  },
  fn3: {
    id: "fn3",
    branch: ["fn1"],
    description: () => i18n.t("neutron_upgrade_fn3_description", { value: formatPercents(0.075, 1) }),
    effect: 0.925,
    requirement: () => i18n.t("neutron_upgrade_fn3_requirement", { value: format(DC.E7) }),
    check: () => Currency.uQuarks.value.max(Currency.uLeptons.value).gte(DC.E7),
    cost: DC.E31
  },
  fn4: {
    id: "fn4",
    branch: ["fn1"],
    isUnlocked: () => NeutronUpgrade.fn2.isBought,
    description: () => i18n.t("neutron_upgrade_fn4_description"),
    effect: DC.D2,
    cost: DC.E39
  },
  fn5: {
    id: "fn5",
    branch: ["fn1"],
    isUnlocked: () => NeutronUpgrade.fn2.isBought,
    description: () => i18n.t("neutron_upgrade_fn5_description", { value: formatInt(35) }),
    effect: DC.D35,
    requirement: () => i18n.t("neutron_upgrade_fn5_requirement", { value: format(DC.E1_25E4) }),
    check: () => (
      FermionType.leptons.fermions.electron.isActive &&
      Currency.quark.gte(DC.E1_25E4)
    ),
    cost: DC.E42
  },
  fn6: {
    id: "fn6",
    branch: ["fn2"],
    description: () => i18n.t("neutron_upgrade_fn6_description"),
    requirement: () => i18n.t("neutron_upgrade_fn6_requirement", { value: formatMass(DC.D1_5E40056) }),
    check: () => (FermionType.quarks.fermions.charm.isActive &&
      Challenge(5).isRunning &&
      Currency.mass.gte(DC.D1_5E40056)
    ),
    cost: DC.E48
  },
  fn7: {
    id: "fn7",
    branch: ["fn6"],
    description: () => i18n.t("neutron_upgrade_fn7_description"),
    cost: DC.E90
  },
  fn8: {
    id: "fn8",
    branch: ["fn7"],
    description: () => i18n.t("neutron_upgrade_fn8_description"),
    cost: DC.E159
  },
  fn9: {
    id: "fn9",
    branch: ["fn1"],
    description: () => i18n.t("neutron_upgrade_fn9_description", { value: formatInt(2) }),
    effect: DC.D2,
    cost: DC.E166
  },
  fn10: {
    id: "fn10",
    branch: ["fn5"],
    isUnlocked: () => Primordium.isUnlocked,
    description: () => i18n.t("neutron_upgrade_fn10_description"),
    requirement: () => i18n.t("neutron_upgrade_fn10_requirement", { value: format(DC.E1_5E8) }),
    check: () => (FermionType.leptons.fermions.electron.isActive &&
      Challenge(9).isRunning &&
      Currency.atoms.gte(DC.E1_5E8)
    ),
    effect: DC.D4_5,
    cost: DC.E600
  },
  fn11: {
    id: "fn11",
    isUnlocked: () => Primordium.isUnlocked,
    branch: ["fn9"],
    description: () => i18n.t("neutron_upgrade_fn11_description", { value: formatInt(5) }),
    effect: DC.D5,
    cost: DC.E680
  },
  fn12: {
    id: "fn12",
    branch: ["fn3"],
    description: () => i18n.t("neutron_upgrade_fn12_description", { value: formatPercents(0.1, 0) }),
    effect: DC.D0_9,
    cost: DC.E960
  },
  rad1: {
    id: "rad1",
    branch: [],
    isUnlocked: () => Radiation.isUnlocked,
    description: () => i18n.t("neutron_upgrade_rad1_description"),
    effect: () => Currency.supernova.value.add(1),
    formatEffect: value => formatX(value),
    cost: DC.E54
  },
  rad2: {
    id: "rad2",
    branch: ["rad1"],
    description: () => i18n.t("neutron_upgrade_rad2_description", { value: formatX(DC.E1, 0) }),
    effect: DC.E1,
    cost: DC.E72
  },
  rad3: {
    id: "rad3",
    branch: ["rad1"],
    description: () => i18n.t("neutron_upgrade_rad3_description", { value: formatX(1.1, 1) }),
    effect: 1.1,
    cost: DC.E86
  },
  rad4: {
    id: "rad4",
    branch: ["rad2"],
    description: () => i18n.t("neutron_upgrade_rad4_description"),
    effect: DC.D2,
    cost: DC.E118
  },
  rad5: {
    id: "rad5",
    branch: ["rad3"],
    description: () => i18n.t("neutron_upgrade_rad5_description", { value: formatPercents(0.1, 0) }),
    effect: () => DC.D1_1.pow(Currency.supernova.value),
    formatEffect: value => formatX(value),
    cost: DC.E170
  },
  rad6: {
    id: "rad6",
    branch: ["rad4"],
    isUnlocked: () => Primordium.isUnlocked,
    description: () => i18n.t("neutron_upgrade_rad6_description"),
    cost: DC.E490
  },
  qf1: {
    id: "qf1",
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    branch: [],
    description: () => i18n.t("neutron_upgrade_qf1_description"),
    effect: () => Currency.supernova.value.sqrt().div(10).add(1),
    formatEffect: value => formatX(value),
    cost: DC.E290
  },
  qf2: {
    id: "qf2",
    isUnlocked: () => Primordium.isUnlocked,
    branch: ["qf1"],
    description: () => i18n.t("neutron_upgrade_qf2_description"),
    effect: () => Currency.neutronStars.value.add(1).log10().add(1).pow(DC.C1D3),
    formatEffect: value => formatX(value),
    cost: DC.E735
  },
  qf3: {
    id: "qf3",
    isUnlocked: () => QuantumChallenges.areUnlocked,
    branch: ["qf2"],
    description: () => i18n.t("neutron_upgrade_qf3_description"),
    effect: () => Currency.blueprint.value.add(1).log10().add(1).pow(2),
    formatEffect: value => formatX(value),
    cost: DC.E850
  },
  qf4: {
    id: "qf4",
    branch: ["qf3"],
    description: () => i18n.t("neutron_upgrade_qf4_description", { value: format(0.5, 1) }),
    effect: DC.D0_5,
    cost: DC.E1000
  },
  qu0: {
    id: "qu0",
    isUnlocked: () => PlayerProgress.quantumUnlocked(),
    branch: [],
    description: () => i18n.t("neutron_upgrade_qu0_description"),
    cost: DC.D0,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu1: {
    id: "qu1",
    branch: ["qu0"],
    description: () => i18n.t("neutron_upgrade_qu1_description", { value: formatPercents(0.2, 0) }),
    effect: DC.D1_2,
    cost: DC.D1,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu2: {
    id: "qu2",
    branch: ["qu0"],
    description: () => i18n.t("neutron_upgrade_qu2_description"),
    cost: DC.D1,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu3: {
    id: "qu3",
    branch: ["qu0"],
    description: () => i18n.t("neutron_upgrade_qu3_description", { value: formatPercents(0.3, 0) }),
    effect: DC.D0_7,
    cost: DC.D1,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu4: {
    id: "qu4",
    branch: ["qu1", "qu2", "qu3"],
    description: () => i18n.t("neutron_upgrade_qu4_description"),
    cost: DC.D35,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu5: {
    id: "qu5",
    branch: ["qu4"],
    description: () => i18n.t("neutron_upgrade_qu5_description"),
    effect: () => overflow(MassUpgrade.tickspeed.effectValue.add(1).log10().add(1).log10().add(1).pow(3), DC.D5E8, DC.D0_1),
    formatEffect: value => formatX(value),
    cost: DC.E2,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu6: {
    id: "qu6",
    branch: ["qu5"],
    description: () => i18n.t("neutron_upgrade_qu6_description"),
    effect: () => Currency.quantizes.value.add(1).log10().add(1),
    formatEffect: value => formatX(value),
    cost: DC.E3,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu7: {
    id: "qu7",
    branch: ["qu6"],
    description: () => i18n.t("neutron_upgrade_qu7_description"),
    effect: () => QuantumChallenges.shards + 1,
    formatEffect: value => formatX(value, 0),
    cost: DC.E15,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu8: {
    id: "qu8",
    branch: ["qu7"],
    description: () => i18n.t("neutron_upgrade_qu8_description"),
    effect: () => QuantumChallenges.effect.clampMin(1),
    formatEffect: value => formatX(value, 1),
    cost: DC.E21,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qu9: {
    id: "qu9",
    isUnlocked: () => Entropy.isUnlocked,
    branch: ["qu8"],
    description: "Gain more Quantizes based on total Primordium Particles.",
    effect: () => Primordium.totalTheorems,
    formatEffect: value => formatX(value, 0),
    cost: DC.E24,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  prim1: {
    id: "prim1",
    branch: ["qu5"],
    description: () => i18n.t("neutron_upgrade_prim1_description", { value: formatInt(1) }),
    effect: DC.D1,
    cost: DC.D200,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  prim2: {
    id: "prim2",
    branch: ["prim1"],
    description: () => i18n.t("neutron_upgrade_prim2_description"),
    cost: DC.D500,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  prim3: {
    id: "prim3",
    isUnlocked: () => QuantumChallenges.areUnlocked,
    branch: ["prim2"],
    description: () => i18n.t("neutron_upgrade_prim3_description"),
    effect: () => (QuantumChallenges.isActive ? DC.D2 : DC.D1),
    cost: DC.E16,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qc1: {
    id: "qc1",
    isUnlocked: () => QuantumChallenges.areUnlocked,
    branch: ["qu5"],
    description: () => i18n.t("neutron_upgrade_qc1_description"),
    cost: DC.E10,
    effect: () => Math.pow(QuantumChallenges.shards, 0.75),
    formatEffect: value => i18n.t("X_later", { value: formatPow(value) }),
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  },
  qc2: {
    id: "qc2",
    isUnlocked: () => Entropy.isUnlocked,
    branch: ["qc1"],
    requirement: () => `Reach ${formatMass(uni(DC.EE5))} of mass with QS 70 build.`,
    check: () => (
      QuantumChallenges.isActive &&
      QuantumChallenges.pendingShards.value >= 70 &&
      Currency.mass.gte(uni(DC.EE5))
    ),
    description: () => `Get an extra shard when a nerf reached ${formatInt(10)}.`,
    cost: DC.E27,
    type: NEUTRON_UPGRADE_TYPE.QUANTUM
  }
};