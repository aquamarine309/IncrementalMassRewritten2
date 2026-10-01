<script>
import Decimal from "break_eternity.js";
import PrimaryButton from "@/components/PrimaryButton";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "RadiationBox",
  components: {
    PrimaryButton,
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    radiation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      distance: new Decimal(),
      distanceGain: new Decimal(),
      effect: new Decimal(),
      amplitude: new Decimal(),
      velocity: new Decimal(),
      total: new Decimal(),
      amplitudeCost: new Decimal(),
      velocityCost: new Decimal(),
      amplitudeAffordbale: false,
      velocityAffordbale: false
    };
  },
  computed: {
    boosts() {
      return this.radiation.boosts;
    },
    name() {
      return this.radiation.name;
    },
    isVisible() {
      return this.radiation.id === 3;
    },
    previousName() {
      const id = this.radiation.id;
      if (id === 0) return i18n.t("frequency");
      return i18n.t("distance_of_X", { value: RadiationType.all[id - 1].name });
    }
  },
  methods: {
    update() {
      const radiation = this.radiation;
      this.isUnlocked = radiation.isUnlocked;
      if (!this.isUnlocked) return;
      this.distance.copyFrom(radiation.distance);
      this.distanceGain.copyFrom(radiation.distanceGain);
      this.effect = radiation.effectValue;
      this.amplitude.copyFrom(radiation.amplitude);
      this.velocity.copyFrom(radiation.velocity);
      this.total = radiation.total;
      this.amplitudeCost = radiation.amplitudeCost;
      this.velocityCost = radiation.velocityCost;
      this.amplitudeAffordable = this.distance.gte(radiation.amplitudeCost);
      this.velocityAffordable = this.distance.gte(radiation.velocityCost);
    },
    purchaseAmplitude() {
      this.radiation.purchaseAmplitude();
    },
    purchaseVelocity() {
      this.radiation.purchaseVelocity();
    },
    amountText(boost) {
      if (boost.extraAmount.eq(0)) {
        return format(boost.baseAmount, 0);
      }
      return `${format(boost.baseAmount, 0)}+${format(boost.extraAmount, 2)}`;
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="o-radiation-box"
    :class="{ 'o-radiation-box--visible': isVisible }"
  >
    <div class="c-radiation-title">
      {{ name }}
    </div>
    <div>
      <i18n-t
        keypath="distance_X"
        tag="div"
      >
        <template #value>
          <span class="o-highlight">
            {{ $tc("X_meter", checkSingle(distance), { value: `${format(distance)} ${formatGain(distance, distanceGain)}` }) }}
          </span>
        </template>
      </i18n-t>
      <i18n-t
        keypath="multiplier_X_to_Y"
        tag="div"
      >
        <template #value>
          <span class="o-highlight">{{ formatX(effect) }}</span>
        </template>
        <template #object>
          {{ previousName }}
        </template>
      </i18n-t>
    </div>
    <div class="c-radiation-upgrade-container">
      <PrimaryButton
        :enabled="amplitudeAffordable"
        @click="purchaseAmplitude"
      >
        <span>{{ $t("amplitude_X", { value: format(amplitude, 0) }) }}</span>
        <br>
        <span>
          {{ $t("cost_X", {
            value: $tc("X_meter",
                       checkSingle(amplitudeCost),
                       { value: format(amplitudeCost) })
          }) }}
        </span>
      </PrimaryButton>
      <PrimaryButton
        :enabled="velocityAffordable"
        @click="purchaseVelocity"
      >
        <span>{{ $t("velocity_X", { value: format(velocity, 0) }) }}</span>
        <br>
        <span>
          {{ $t("cost_X", {
            value: $tc("X_meter",
                       checkSingle(velocityCost),
                       { value: format(velocityCost) })
          }) }}
        </span>
      </PrimaryButton>
    </div>
    <div class="c-radiation-boost-container">
      <div
        v-for="boost in boosts"
        :key="boost.id"
        class="c-radiation-boost"
      >
        <span class="o-boost-title">{{ boost.title }}[{{ amountText(boost) }}]</span>
        <DescriptionDisplay :config="boost.config" />
        <EffectDisplay :config="boost.config" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-radiation-box {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  padding: 5px;
  border: 1px solid white;
  background: linear-gradient(305deg, #232225, #1e1d1f, #111111);
}

.light-theme .o-radiation-box {
  background: #f6f6f6;
  border-color: #1b1a1e;
}

.ad-ui .o-radiation-box {
  border-radius: 5px;
}

.o-radiation-box--visible {
  background: linear-gradient(135deg,
    rgba(100, 50, 50, 0.7) 0%,
    rgba(100, 70, 40, 0.7) 20%,
    rgba(100, 100, 50, 0.7) 40%,
    rgba(40, 100, 40, 0.7) 60%,
    rgba(40, 60, 100, 0.7) 80%,
    rgba(70, 40, 100, 0.7) 100%);
}

.light-theme .o-radiation-box--visible {
  background: linear-gradient(135deg,
    rgba(255, 200, 200, 0.6) 0%,
    rgba(255, 220, 180, 0.6) 20%,
    rgba(255, 255, 200, 0.6) 40%,
    rgba(200, 255, 200, 0.6) 60%,
    rgba(200, 220, 255, 0.6) 80%,
    rgba(220, 200, 255, 0.6) 100%);
}

.c-radiation-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-accent);
  margin: 5px 0;
}

.c-radiation-upgrade-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.c-radiation-upgrade-container .o-primary-btn {
  flex: 1;
  margin: 0 5px;
}

.c-radiation-boost-container {
  margin: 8px 0;
  display: flex;
}

.c-radiation-boost {
  margin: 0 3px;
  padding: 3px;
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid var(--color-accent);
  font-size: 10px;
  justify-content: space-between;
}

.ad-ui .c-radiation-boost {
  border-radius: 3px;
}

.o-boost-title {
  font-weight: bold;
  font-size: 12px;
}
</style>