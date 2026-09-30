<script>
import ButtomTabButton from "./ButtomTabButton";

export default {
  name: "BottomTabBar",
  components: {
    ButtomTabButton
  },
  computed: {
    tabs() {
      return Tabs.currentUIFormat;
    },
    subtabs() {
      return Tabs.current.subtabs;
    }
  }
};
</script>

<template>
  <div class="l-tab-bar--container">
    <div id="notification-container" />
    <div class="c-tab-bar">
      <ButtomTabButton
        v-for="tab in tabs"
        :key="tab.id"
        :tab="tab"
      />
    </div>
    <div class="c-tab-bar">
      <ButtomTabButton
        v-for="tab in subtabs"
        :key="tab.id"
        :tab="tab"
      />
    </div>
  </div>
</template>

<style scoped>
.l-tab-bar--container {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 1;
}

.c-tab-bar {
  height: 45px;
  background-color: var(--color-app-bar);
  width: 100%;
  display: flex;
  flex-direction: row;
}
</style>