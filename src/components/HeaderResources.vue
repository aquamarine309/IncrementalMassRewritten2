<script>
import Decimal from "break_eternity.js";
import { mlt } from "@/core/math";
import HeaderResource from "./HeaderResource";

export default {
  name: "HeaderResources",
  components: {
    HeaderResource
  },
  data() {
    return {
      mass: {
        amount: new Decimal(),
        rate: new Decimal()
      },
      ragePowers: {
        amount: new Decimal(),
        rate: new Decimal(),
        canReset: false,
        passive: false
      },
      darkMatter: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        canReset: false,
        passive: false
      },
      blackHole: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        evaporating: false
      },
      atoms: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        canReset: false,
        passive: false
      },
      quark: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        passive: true
      },
      dilation: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        active: false,
        passive: false
      },
      supernova: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        canReset: false,
        manual: false
      },
      quantum: {
        amount: new Decimal(),
        rate: new Decimal(),
        unlocked: false,
        canReset: false
      },
      speed: {
        value: new Decimal(),
        unlocked: false
      }
    };
  },
  computed: {
    massTooltip() {
      return `You have pushed ${formatMass(this.mass.amount)}.`;
    },
    ragePowersTooltip() {
      return `Reach over ${formatMass(1e15)} of normal mass to reset previous features for gain Rage Powers.`;
    },
    darkMatterTooltip() {
      return `Reach over ${format(1e20)} Rage Power to reset all previous features for gain Dark Matters.`;
    },
    blackHoleTooltip() {
      return `You have ${formatMass(this.blackHole.amount)} of black hole.`;
    },
    atomTooltip() {
      return `Reach over ${formatMass(1.5e156)} of black hole to reset all previous features for gain Atoms & Quarks.`;
    },
    quarkTooltip() {
      return `You have ${format(this.quark.amount, 0)} Quark.`;
    },
    supernovaTooltip() {
      return `You have become ${format(this.supernova.amount, 0)} Supernova.`;
    },
    quantumTooltip() {
      return `Reach over ${formatMass(mlt(1e4))} of normal mass to go quantum.`;
    },
    speedTooltip() {
      return "Pre-Quantum: Speeds up the production of pre-Quantum resources (after exponent, dilation, etc.).";
    }
  },
  methods: {
    update() {
      const mass = this.mass;
      mass.amount.copyFrom(Currency.mass.value);
      mass.rate = Currency.mass.gainedAmount;

      const ragePowers = this.ragePowers;
      ragePowers.amount.copyFrom(Currency.ragePowers.value);
      ragePowers.rate = Currency.ragePowers.gainedAmount;
      ragePowers.canReset = Resets.rage.canReset;
      ragePowers.passive = BHUpgrade(5).canBeApplied || AtomUpgrade(5).canBeApplied;

      const darkMatter = this.darkMatter;
      darkMatter.unlocked = PlayerProgress.rageUnlocked();
      if (darkMatter.unlocked) {
        darkMatter.amount.copyFrom(Currency.darkMatter.value);
        darkMatter.rate = Currency.darkMatter.gainedAmount;
        darkMatter.canReset = Resets.darkMatter.canReset;
        darkMatter.passive = AtomUpgrade(5).canBeApplied;
      }

      const blackHole = this.blackHole;
      blackHole.unlocked = PlayerProgress.blackHoleUnlocked();
      if (blackHole.unlocked) {
        blackHole.amount.copyFrom(Currency.blackHole.value);
        blackHole.rate = Currency.blackHole.gainedAmount;
        blackHole.evaporating = Entropy.hawkingRadiation.data.isActive;
      }

      const atoms = this.atoms;
      atoms.unlocked = PlayerProgress.blackHoleUnlocked();
      if (atoms.unlocked) {
        atoms.amount.copyFrom(Currency.atoms.value);
        atoms.rate = Currency.atoms.gainedAmount;
        atoms.canReset = Resets.atom.canReset;
        atoms.passive = GameElement(24).canBeApplied;
      }

      const quark = this.quark;
      quark.unlocked = PlayerProgress.atomUnlocked();
      if (quark.unlocked) {
        quark.amount.copyFrom(Currency.quark.value);
        quark.passive = GameElement(14).canBeApplied;
        quark.rate = Currency.quark.gainedAmount;
        if (quark.passive) {
          quark.rate = quark.rate.times(0.05 + GameElement(16).effectOrDefault(0));
        }
      }

      const dilation = this.dilation;
      dilation.unlocked = MassDilation.isUnlocked;
      if (dilation.unlocked) {
        dilation.amount.copyFrom(Currency.relativisticParticles.value);
        dilation.rate = Currency.relativisticParticles.gainedAmount;
        dilation.active = MassDilation.isActive;
        dilation.passive = NeutronUpgrade.qol3.canBeApplied;
      }

      const supernova = this.supernova;
      supernova.unlocked = PlayerProgress.supernovaUnlocked();
      if (supernova.unlocked) {
        supernova.amount.copyFrom(Currency.supernova.value);
        supernova.manual = PlayerProgress.quantumUnlocked() || Supernova.times.gte(10);
        if (supernova.manual) {
          supernova.rate = Currency.supernova.gainedAmount;
        }
        supernova.canReset = Resets.supernova.canReset;
      }

      const quantum = this.quantum;
      quantum.unlocked = Challenge(12).milestones[0].canBeApplied || PlayerProgress.quantumUnlocked();
      if (quantum.unlocked) {
        quantum.amount.copyFrom(Currency.quantumFoam.value);
        quantum.rate = Currency.quantumFoam.gainedAmount;
        quantum.canReset = Resets.quantum.canReset;
      }

      const speed = this.speed;
      speed.unlocked = PlayerProgress.quantumUnlocked();
      if (speed.unlocked) {
        speed.value = Quantum.speed;
      }
    },
    formatNoPlaces(value) {
      return format(value, 0);
    },
    ragePowerReset() {
      Resets.rage.requestReset();
    },
    darkMatterReset() {
      Resets.darkMatter.requestReset();
    },
    atomReset() {
      Resets.atom.requestReset();
    },
    dilatedMass() {
      MassDilation.toggle();
    },
    supernovaReset() {
      Resets.supernova.requestReset();
    },
    quantumReset() {
      Resets.quantum.requestReset();
    }
  }
};
</script>

<template>
  <div class="l-game-header">
    <HeaderResource
      img-class="i-mass"
      :amount="mass.amount"
      :gain-rate="mass.rate"
      :is-mass="true"
      name="Mass"
      :tooltip="massTooltip"
      :show-tooltip="true"
    />
    <HeaderResource
      img-class="i-rage-powers"
      :amount="ragePowers.amount"
      :gain-rate="ragePowers.rate"
      text-class="c-rage-powers-amount"
      border-class="o-rp-border"
      :format-fn="formatNoPlaces"
      name="Rage Powers"
      :is-rate="ragePowers.passive"
      :tooltip="ragePowersTooltip"
      :show-tooltip="!ragePowers.canReset"
      :click-fn="ragePowerReset"
    />
    <HeaderResource
      v-if="darkMatter.unlocked"
      img-class="i-dark-matter"
      :amount="darkMatter.amount"
      :gain-rate="darkMatter.rate"
      text-class="c-dark-matter-amount"
      border-class="o-dark-matter-border"
      :format-fn="formatNoPlaces"
      name="Dark Matter"
      :is-rate="darkMatter.passive"
      :tooltip="darkMatterTooltip"
      :show-tooltip="!darkMatter.canReset"
      :click-fn="darkMatterReset"
    />
    <HeaderResource
      v-if="darkMatter.unlocked"
      img-class="i-black-hole"
      :amount="blackHole.amount"
      border-class="o-dark-matter-border"
      :gain-rate="blackHole.rate"
      text-class="c-dark-matter-amount"
      :is-mass="true"
      name="Black Hole"
      :tooltip="blackHoleTooltip"
      :show-tooltip="true"
      :force-text="blackHole.evaporating ? $t('being_evaporated') : ''"
    />
    <HeaderResource
      v-if="atoms.unlocked"
      img-class="i-atom"
      :amount="atoms.amount"
      :gain-rate="atoms.rate"
      :format-fn="formatNoPlaces"
      name="Atom"
      :is-rate="atoms.passive"
      :tooltip="atomTooltip"
      :show-tooltip="!atoms.canReset"
      :click-fn="atomReset"
    />
    <HeaderResource
      v-if="quark.unlocked"
      img-class="i-quark"
      text-class="o-quark"
      border-class="o-quark-border"
      :amount="quark.amount"
      :gain-rate="quark.rate"
      :format-fn="formatNoPlaces"
      name="Quark"
      :is-rate="quark.passive"
      :tooltip="quarkTooltip"
      :show-tooltip="true"
    />
    <HeaderResource
      v-if="dilation.unlocked"
      img-class="i-dilation"
      text-class="o-dilation"
      border-class="o-dilation-border"
      :amount="dilation.amount"
      :gain-rate="dilation.rate"
      :format-fn="formatNoPlaces"
      name="Mass Dilation"
      :is-rate="dilation.passive"
      :show-tooltip="false"
      :click-fn="dilatedMass"
      :force-text="dilation.active || dilation.passive ? '' : 'Inactive'"
    />
    <HeaderResource
      v-if="supernova.unlocked"
      img-class="i-supernova"
      text-class="o-supernova"
      border-class="o-supernova-border"
      :amount="supernova.amount"
      :gain-rate="supernova.rate"
      :format-fn="formatNoPlaces"
      name="Supernova"
      :is-rate="false"
      :show-tooltip="!supernova.canReset"
      :tooltip="supernovaTooltip"
      :click-fn="supernovaReset"
      :show-rate="supernova.manual"
    />
    <HeaderResource
      v-if="quantum.unlocked"
      img-class="i-quantum"
      text-class="o-quantum"
      border-class="o-quantum-border"
      :amount="quantum.amount"
      :gain-rate="quantum.rate"
      :format-fn="formatNoPlaces"
      name="Quantum Foam"
      :is-rate="false"
      :show-tooltip="!quantum.canReset"
      :tooltip="quantumTooltip"
      :click-fn="quantumReset"
    />
    <HeaderResource
      v-if="speed.unlocked"
      img-class="i-speed"
      text-class="o-speed-text"
      border-class="o-speed-border"
      :amount="speed.value"
      :format-fn="formatMult"
      name="Global Speed"
      :is-rate="false"
      :show-tooltip="true"
      :show-rate="false"
      :tooltip="speedTooltip"
    />
  </div>
</template>