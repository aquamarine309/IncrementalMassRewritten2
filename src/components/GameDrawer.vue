<script>
import TabButton from "./TabButton";

export default {
  name: "GameDrawer",
  components: {
    TabButton
  },
  computed: {
    tabs() {
      return Tabs.currentUIFormat;
    },
    expandBits: {
      get() {
        return this.$viewModel.expandBits;
      },
      set(value) {
        this.$viewModel.expandBits = value;
      }
    }
  },
  methods: {
    isExpanded(id) {
      return (this.expandBits & (1 << id)) !== 0;
    },
    expand(id) {
      this.expandBits |= (1 << id);
    },
    collapse(id) {
      this.expandBits &= ~(1 << id);
    },
    toggle(id) {
      if (this.isExpanded(id)) this.collapse(id);
      else this.expand(id);
    },
    closeDrawer() {
      this.$emit("close-drawer");
    }
  }
};
</script>

<template>
  <div
    v-touch:swipe.left="closeDrawer"
    class="l-drawer v-touch"
  >
    <div class="c-drawer-top">
      <div class="c-game-icon" />
      <div><b>{{ $t("app_name") }}</b></div>
    </div>
    <div class="c-drawer-tabs">
      <TabButton
        v-for="tab in tabs"
        :key="tab.id"
        :tab="tab"
        :is-expanded="isExpanded(tab.id)"
        @toggle="toggle"
        @close-drawer="closeDrawer"
      />
    </div>
  </div>
</template>