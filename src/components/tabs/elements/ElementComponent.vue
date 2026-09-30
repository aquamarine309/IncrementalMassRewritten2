<script>
export default {
  name: "ElementComponent",
  props: {
    element: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isBought: false,
      canBeBought: false
    };
  },
  computed: {
    config() {
      return this.element.config;
    },
    id() {
      return this.config.id;
    },
    position() {
      return this.config.position;
    },
    classObject() {
      return {
        "o-element-grid": true,
        "o-element-grid--available": this.canBeBought,
        "o-element-grid--bought": this.isBought,
        "o-element-grid--selected": this.isSelected
      };
    },
    styleObject() {
      return {
        top: `${30 * this.position[0] + 1}px`,
        left: `${30 * this.position[1] + 1}px`
      };
    }
  },
  methods: {
    update() {
      this.isUnlocked = this.element.isUnlocked;
      this.isBought = this.element.isBought;
      this.canBeBought = this.element.canBeBought;
    },
    handleClick() {
      this.element.purchase();
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    :class="classObject"
    :style="styleObject"
    @click="handleClick"
  >
    <span class="c-element-id">{{ id }}</span>
    <span class="c-element-name">
      {{ name }}
    </span>
  </div>
</template>

<style scoped>
.c-element-id {
  font-size: 8px;
}

.c-element-name {
  font-size: 12px;
}
</style>