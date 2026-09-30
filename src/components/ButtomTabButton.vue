<script>
export default {
  name: "TabButton",
  props: {
    tab: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      isActive: false,
      iconifyTab: false
    };
  },
  computed: {
    name() {
      if (this.iconifyTab) return this.tab.symbol;
      return (this.tab.letter ?? this.tab.shortName).toUpperCase();
    },
    tabClass() {
      return {
        "c-bottom-tab": true,
        "c-bottom-tab--active": this.isActive
      };
    },
    tabStyle() {
      const color = this.tab.config.color;
      if (!color) return null;
      return { color };
    }
  },
  methods: {
    update() {
      const tab = this.tab;
      this.isAvailable = tab.isAvailable && !tab.isHidden;
      this.isActive = tab.isOpen;
      this.iconifyTab = player.options.iconifyTab;
    },
    show() {
      this.tab.show(true);
    }
  }
};
</script>

<template>
  <div
    v-if="isAvailable"
    :class="tabClass"
    :style="tabStyle"
    @click="show()"
    v-html="name"
  />
</template>

<style scoped>
.c-bottom-tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 13px;
  transition-duration: 0.2s;
  color: rgba(255, 255, 255, 0.67);
}

.c-bottom-tab svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  fill: currentColor;
}

.c-bottom-tab--active {
  color: white;
  border-bottom: 2px solid #d81b60;
}
</style>