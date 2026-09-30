<script>
import Decimal from "break_eternity.js";
import BosonUpgradeButton from "./BosonUpgradeButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "BosonsTab",
  components: {
    BosonUpgradeButton,
    PrimaryToggleButton
  },
  data() {
    return {
      positiveW: new Decimal(),
      negativeW: new Decimal(),
      graviton: new Decimal(),
      photon: new Decimal(),
      gluon: new Decimal(),
      higgsBoson: new Decimal(),
      zBoson: new Decimal(),
      positiveWGain: new Decimal(),
      negativeWGain: new Decimal(),
      gravitonGain: new Decimal(),
      photonGain: new Decimal(),
      gluonGain: new Decimal(),
      higgsBosonGain: new Decimal(),
      zBosonGain: new Decimal(),
      gravitonEffect: new Decimal(),
      higgsBosonEffect: new Decimal(),
      positiveWMass: new Decimal(),
      positiveWNeg: new Decimal(),
      negativeWSoftcap: new Decimal(),
      negativeWPos: new Decimal(),
      zBosonTickspeed: new Decimal(),
      zBosonW: new Decimal(),
      autoUnlocked: false,
      auto: false
    };
  },
  computed: {
    photonUpgrade: () => PhotonUpgrade,
    gluonUpgrade: () => GluonUpgrade
  },
  watch: {
    auto(value) {
      Autobuyer.bosonUpgrade.isActive = value;
    }
  },
  methods: {
    update() {
      this.positiveW.copyFrom(Boson.positiveW.amount);
      this.negativeW.copyFrom(Boson.negativeW.amount);
      this.graviton.copyFrom(Boson.graviton.amount);
      this.photon.copyFrom(Boson.photon.amount);
      this.gluon.copyFrom(Boson.gluon.amount);
      this.higgsBoson.copyFrom(Boson.higgsBoson.amount);
      this.zBoson.copyFrom(Boson.zBoson.amount);
      this.positiveWGain = Boson.positiveW.gain;
      this.negativeWGain = Boson.negativeW.gain;
      this.gravitonGain = Boson.graviton.gain;
      this.photonGain = Boson.photon.gain;
      this.gluonGain = Boson.gluon.gain;
      this.higgsBosonGain = Boson.higgsBoson.gain;
      this.zBosonGain = Boson.zBoson.gain;
      this.positiveWMass = Boson.positiveW.effects.mass.effectValue;
      this.negativeWPos = Boson.negativeW.effects.positiveW.effectValue;
      this.negativeWSoftcap = Boson.negativeW.effects.softcap.effectValue;
      this.positiveWNeg = Boson.positiveW.effects.negativeW.effectValue;
      this.gravitonEffect = Boson.graviton.effectValue;
      this.higgsBosonEffect = Boson.higgsBoson.effectValue;
      this.zBosonTickspeed = Boson.zBoson.effects.tickspeed.effectValue;
      this.zBosonW = Boson.zBoson.effects.wBosons.effectValue;
      this.autoUnlocked = Autobuyer.bosonUpgrade.isUnlocked;
      this.auto = Autobuyer.bosonUpgrade.isActive;
    }
  }
};
</script>

<template>
  <div class="l-bosons-tab">
    <div>
      <PrimaryToggleButton
        v-if="autoUnlocked"
        v-model="auto"
        i18n-key="auto_X"
      />
    </div>
    <div class="c-bosons-row">
      <div class="c-boson-grid c-boson-graviton">
        <i18n
          path="boson_graviton_description"
          tag="div"
        >
          <template #amountAndGain>
            <span class="o-boson-amount--accent">
              {{ format(graviton) }} {{ formatGain(graviton, gravitonGain) }}
            </span>
          </template>
          <template #effect>
            {{ format(gravitonEffect) }}
          </template>
        </i18n>
      </div>
      <div class="c-boson-grid c-boson-higgs">
        <i18n
          path="boson_higgs_boson_description"
          tag="div"
        >
          <template #amountAndGain>
            <span class="o-boson-amount--accent">
              {{ format(higgsBoson) }} {{ formatGain(higgsBoson, higgsBosonGain) }}
            </span>
          </template>
          <template #effect>
            {{ format(higgsBosonEffect) }}
          </template>
        </i18n>
      </div>
    </div>
    <div class="c-bosons-row">
      <div class="c-boson-grid c-boson-photon">
        <div class="c-boson-amount">
          <i18n
            path="boson_photon_description"
            tag="span"
          >
            <template #amountAndGain>
              <span class="o-boson-amount--accent">
                {{ format(photon) }} {{ formatGain(photon, photonGain) }}
              </span>
            </template>
          </i18n>
        </div>
        <BosonUpgradeButton
          v-for="upgrade in photonUpgrade"
          :key="upgrade.id + upgrade.type"
          :upgrade="upgrade"
        />
      </div>
      <div class="c-boson-grid c-boson-gluon">
        <div class="c-boson-amount">
          <i18n
            path="boson_gluon_description"
            tag="span"
          >
            <template #amountAndGain>
              <span class="o-boson-amount--accent">
                {{ format(gluon) }} {{ formatGain(gluon, gluonGain) }}
              </span>
            </template>
          </i18n>
        </div>
        <BosonUpgradeButton
          v-for="upgrade in gluonUpgrade"
          :key="upgrade.id + upgrade.type"
          :upgrade="upgrade"
        />
      </div>
    </div>
    <div class="c-bosons-row-other">
      <div class="c-boson-grid c-boson-other">
        <i18n
          path="boson_positive_w_description"
          tag="div"
        >
          <template #amountAndGain>
            <span class="o-boson-amount--accent">
              {{ format(positiveW) }} {{ formatGain(positiveW, positiveWGain) }}
            </span>
          </template>
          <template #massEffect>
            {{ format(positiveWMass) }}
          </template>
          <template #gainEffect>
            {{ format(positiveWNeg) }}
          </template>
        </i18n>
      </div>
      <div class="c-boson-grid c-boson-other">
        <i18n
          path="boson_negative_w_description"
          tag="div"
        >
          <template #amountAndGain>
            <span class="o-boson-amount--accent">
              {{ format(negativeW) }} {{ formatGain(negativeW, negativeWGain) }}
            </span>
          </template>
          <template #softcapEffect>
            {{ formatPow(negativeWSoftcap) }}
          </template>
          <template #gainEffect>
            {{ format(negativeWPos) }}
          </template>
        </i18n>
      </div>
      <div class="c-boson-grid c-boson-other">
        <i18n
          path="boson_z_boson_description"
          tag="div"
        >
          <template #amountAndGain>
            <span class="o-boson-amount--accent">
              {{ format(zBoson) }} {{ formatGain(zBoson, zBosonGain) }}
            </span>
          </template>
          <template #tickspeedEffect>
            {{ format(zBosonTickspeed) }}
          </template>
          <template #gainEffect>
            {{ format(zBosonW) }}
          </template>
        </i18n>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-bosons-tab {
  display: flex;
  flex-direction: column;
}

.c-bosons-row {
  display: flex;
  flex-direction: row;
}

.c-bosons-row-other {
  display: flex;
  flex-direction: column;
}

.c-boson-grid {
  flex: 1;
  margin: 1px;
  padding: 6px;
  color: white;
}

.ad-ui .c-boson-grid {
  border-radius: 5px;
}

.c-boson-amount {
  height: 50px;
}

.c-boson-graviton {
  background-color: rgba(86, 35, 180, 0.7);
}

.c-boson-higgs {
  background-color: rgba(176, 135, 52, 0.7);
}

.c-boson-photon {
  background-color: rgba(186, 165, 76, 0.7);
}

.c-boson-gluon {
  background-color: rgba(176, 72, 168, 0.7);
}

.c-boson-other {
  background-color: rgba(84, 84, 84, 0.7);
}

.o-boson-amount--accent {
  font-weight: bold;
}
</style>