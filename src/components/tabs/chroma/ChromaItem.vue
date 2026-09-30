<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ChromaItem",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    PrimaryButton
  },
  props: {
    chroma: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      amount: new Decimal(0),
      gain: new Decimal(0),
      isUnlocked: false,
      canBeUnlocked: false
    };
  },
  computed: {
    id() {
      return this.chroma.id;
    },
    imgStyle() {
      return {
        "background-image": `url("./images/chroma/chroma${this.id}.png")`
      };
    },
    name() {
      return i18n.t(this.config.key);
    },
    color() {
      return this.config.color;
    },
    config() {
      return this.chroma.config;
    },
    colorStyle() {
      return {
        "--color-chroma": `var(--color-chroma${this.id})`
      };
    }
  },
  methods: {
    update() {
      this.amount.copyFrom(this.chroma.amount);
      this.gain = this.chroma.gain;
      this.isUnlocked = this.chroma.isUnlocked;
      this.canBeUnlocked = this.chroma.canBeUnlocked;
    },
    unlock() {
      this.chroma.unlock();
    }
  }
};
</script>

<template>
  <div
    class="l-chroma-item"
    :style="colorStyle"
  >
    <div class="c-half-panel">
      <div
        class="o-chroma-image"
        :style="imgStyle"
      />
    </div>
    <div class="c-half-panel">
      <div class="c-chroma-color-bg" />
      <span class="o-chroma-name">{{ name }}</span>
      <span>You have {{ format(amount) }} {{ formatGain(amount, gain) }} {{ color }} Chroma.</span>
      <DescriptionDisplay :config="config" />
      <EffectDisplay :config="config" />
      <PrimaryButton
        v-if="!isUnlocked"
        :enabled="canBeUnlocked"
        class="o-high-layer"
        @click="unlock"
      >
        {{ $t("unlock_chroma_text", { value: name }) }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-chroma-item {
  display: flex;
  flex-direction: row;
  padding: 8px;
}

.l-chroma-item:not(:last-child) {
  border-bottom: 1px solid #9a9a9a;
}

.c-half-panel {
  flex-direction: column;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 6px 3px;
  color: var(--color-chroma);
  position: relative;
}

.c-chroma-color-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--color-chroma);
  opacity: 30%;
  z-index: 0;
  margin-bottom: 6px;
}

.ad-ui .c-chroma-color-bg {
  border-radius: 3px;
}

.o-chroma-image {
  width: 70px;
  height: 70px;
  background-size: cover;
}

.o-chroma-name {
  font-weight: bold;
  font-size: 15px;
}

.o-high-layer {
  z-index: 1;
}
</style>