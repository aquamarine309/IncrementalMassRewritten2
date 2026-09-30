<script>
export default {
  name: "PrimaryButton",
  props: {
    enabled: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ["click"],
  computed: {
    classObject() {
      return {
        "o-primary-btn--disabled": !this.enabled,
      };
    }
  },
  methods: {
    handleClick(event) {
      this.$emit("click", event);
    }
  }
};
</script>

<template>
  <button
    class="o-primary-btn"
    :class="classObject"
    @click="handleClick"
  >
    <slot />
  </button>
</template>