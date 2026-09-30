<script>
export default {
  name: "NotificationButton",
  data() {
    return {
      isVisible: true,
      tab: "main",
      subtab: "mass"
    };
  },
  methods: {
    update() {
      const notification = getNotification();
      this.isVisible = notification !== null;
      if (this.isVisible) {
        this.tab = notification[0];
        this.subtab = notification[1];
      }
    },
    openTab() {
      Tab[this.tab]?.[this.subtab]?.show?.(true);
    }
  }
};
</script>

<template>
  <button
    v-if="isVisible"
    class="o-primary-btn o-primary-btn--notification"
    @click="openTab"
  >
    !
  </button>
</template>

<style scoped>
.o-primary-btn--notification {
  width: 30px;
  height: 30;
  position: fixed;
  right: 30px;
  top: calc(var(--height-app-bar) + 30px);
  z-index: 2;
}
</style>