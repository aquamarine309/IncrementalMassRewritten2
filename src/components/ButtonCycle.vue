<script>
export default {
  name: "ButtonCycle",
  props: {
    i18nKey: {
      type: String,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Number,
      required: true
    },
  },
  emits: ["update:modelValue"],
  computed: {
    displayText() {
      return i18n.t(this.i18nKey, { value: this.labels[this.modelValue] });
    }
  },
  methods: {
    handleClick() {
      this.$emit("update:modelValue", (this.modelValue + 1) % this.labels.length);
    }
  }
};
</script>

<template>
  <button
    v-bind="$attrs"
    @click="handleClick"
  >
    {{ displayText }}
  </button>
</template>