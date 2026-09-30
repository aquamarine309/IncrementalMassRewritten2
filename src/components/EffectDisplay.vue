<script>
import Decimal from "break_eternity.js";
import { isDecimal, isFunction, isNumber } from "@/utility/type-check";

/* eslint-disable no-empty-function */
export default {
  name: "EffectDisplay",
  props: {
    config: {
      type: Object,
      required: false,
      default: undefined
    },
    br: {
      type: Boolean,
      required: false
    },
    ignoreCapped: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data() {
    return {
      isVisible: false,
      effectValue: 0,
      effectValues: null,
      // Number.MAX_VALUE doesn't really matter here, but we need it because
      // undefined values are not allowed for data properties
      cap: Number.MAX_VALUE,
      hasCap: false,
      softcap: false
    };
  },
  computed: {
    reachedCap() {
      return this.hasCap && this.reachedCapFunction();
    },
    effectDisplay() {
      const effect = this.formatEffect(this.effectValues || (this.reachedCap ? this.cap : this.effectValue));
      if (this.config.noLabel) {
        return effect;
      }
      return i18n.t(this.reachedCap && !this.ignoreCapped ? "capped_X" : "currently_X", { effect });
    }
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateEffect = () => { };
        this.updateCap = () => { };
        this.cap = Number.MAX_VALUE;
        this.hasCap = false;
        this.softcapped = () => false;
        const effect = config?.effect || config?.effects?.[config?.mainEffect];
        const formatEffect = config?.formatEffect;
        const effects = config?.effects;
        this.isVisible = (effect ?? effects) !== undefined && formatEffect !== undefined;
        if (!this.isVisible) return;
        this.formatEffect = formatEffect;

        if (effects !== undefined) {
          if (this.effectValues === null) {
            this.effectValues = {};
          }
          for (const key in effects) {
            if (typeof effects[key] !== "function") continue;
            this.effectValues[key] = effects[key]();
          }
          this.updateEffect = () => {
            this.effectValues = {};
            for (const key in effects) {
              if (typeof effects[key] !== "function") continue;
              this.effectValues[key] = effects[key]();
            }
          };
          return;
        }

        if (effect === undefined) {
          return;
        }

        this.effectValues = null;

        const softcapped = config?.softcapped;
        if (softcapped !== undefined) {
          this.softcapped = softcapped;
        }

        if (isNumber(effect)) {
          this.effectValue = effect;
          return;
        }

        if (isDecimal(effect)) {
          this.effectValue = effect.copy();
          return;
        }

        if (!isFunction(effect)) {
          throw new Error(`EffectDisplay config.effect has ` +
            ` unsupported type "${typeof effect}"`);
        }

        const value = effect();

        if (isNumber(value)) {
          this.effectValue = value;
          this.updateEffect = () => {
            this.effectValue = effect();
            this.softcap = this.softcapped(this.effectValue);
          };
        } else if (isDecimal(value)) {
          this.effectValue = value.copy();
          this.updateEffect = () => {
            this.effectValue = effect().copy();
            this.softcap = this.softcapped(this.effectValue);
          };
        } else {
          throw new Error(`EffectDisplay config.effect is a function which returns` +
            ` unsupported type "${typeof effect}"`);
        }

        let cap = config.cap;
        if (config.reachedCap !== undefined) {
          // If the config has a reachedCap, we assume its effect value calculation
          // takes account of the cap itself, so we don't have to.
          cap = () => this.effectValue;
          this.reachedCapFunction = config.reachedCap;
        }
        if (cap !== undefined) {
          if (config.reachedCap === undefined) {
            this.reachedCapFunction = isNumber(value)
              ? () => this.effectValue >= this.cap
              : () => this.effectValue.gte(this.cap);
          }

          if (isNumber(cap)) {
            this.cap = cap;
            this.hasCap = true;
            return;
          }

          if (isDecimal(cap)) {
            this.cap = Decimal.fromDecimal(cap);
            this.hasCap = true;
            return;
          }

          if (isFunction(cap)) {
            this.updateCap = () => {
              this.cap = cap();
              this.hasCap = this.cap !== undefined;
            };
            this.updateCap();
            return;
          }

          throw new Error(`EffectDisplay config.cap is a function which returns` +
            ` unsupported type "${typeof effect}"`);
        }
      }
    },
  },
  beforeCreate() {
    this.updateEffect = () => { };
    this.updateCap = () => { };
    this.softcapped = () => false;
  },
  methods: {
    update() {
      this.updateEffect();
      this.updateCap();
    }
  }
};
</script>

<template>
  <span v-if="isVisible && effectDisplay !== undefined">
    <br v-if="br">
    {{ effectDisplay }}
    <span
      v-if="softcap && !reachedCap"
      class="o-softcapped"
    >
      {{ $t("softcapped") }}
    </span>
  </span>
</template>
