<script>
import { isDecimal, isFunction, isNumber } from "@/utility";

/* eslint-disable no-empty-function */
export default {
  name: "CostDisplay",
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
    nameKey: {
      type: String,
      required: true
    },
    labelKey: {
      type: String,
      default: "cost_X",
      required: false
    }
  },
  data() {
    return {
      isVisible: false,
      cost: 0
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateFunction = () => { };
        const cost = config?.cost;
        this.isVisible = cost !== undefined;
        if (!this.isVisible) return;
        this.formatCost = config.formatCost ?? format;

        if (isNumber(cost)) {
          this.cost = cost;
          return;
        }

        if (isDecimal(cost)) {
          this.cost = cost.copy();
          return;
        }

        if (!isFunction(cost)) {
          throw new Error(`CostDisplay config.cost has unsupported type "${typeof cost}"`);
        }

        const value = cost();

        if (isNumber(value)) {
          this.cost = value;
          this.updateFunction = () => this.cost = cost();
          return;
        }

        if (isDecimal(value)) {
          this.cost = value.copy();
          this.updateFunction = () => this.cost.copyFrom(cost());
          return;
        }

        throw new Error(`CostDisplay config.cost is a function which returns` +
          ` unsupported type "${typeof value}"`);
      }
    }
  },
  beforeCreate() {
    this.updateFunction = () => { };
  },
  methods: {
    update() {
      this.updateFunction();
    }
  }
};
</script>

<template>
  <span v-if="isVisible">
    <br v-if="br">
    {{ $t(labelKey, { value: $tc(nameKey, checkSingle(cost), { value: formatCost(cost) }) }) }}
  </span>
</template>
