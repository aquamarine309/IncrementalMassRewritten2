<script>
export default {
  name: "TabButton",
  props: {
    tab: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      subtabVisibilities: []
    };
  },
  computed: {
    view() {
      return this.$viewModel;
    }
  },
  methods: {
    update() {
      const tab = this.tab;
      this.isAvailable = tab.isAvailable && !tab.isHidden;
      if (!this.isAvailable) return;
      this.subtabVisibilities = tab.subtabs.map(subtab => subtab.isAvailable);
    },
    toggle(id) {
      this.$emit("toggle", id);
    },
    showTab(tab) {
      tab.show(true);
      this.$emit("close-drawer");
    }
  }
};
</script>

<template>
  <div
    v-if="isAvailable"
    class="c-drawer-tab"
  >
    <div
      class="c-drawer-tab-name"
      :class="{ 'c-drawer-tab-name--active': view.tab === tab.key }"
      @click="toggle(tab.id)"
    >
      {{ tab.name }}
    </div>
    <div
      v-if="isExpanded"
      class="c-drawer-subtab-container"
    >
      <template v-for="(subtab, index) in tab.subtabs">
        <div
          v-if="subtabVisibilities[index]"
          :key="subtab.id"
          class="c-drawer-subtab-name"
          :class="{ 'c-drawer-tab-name--active': view.subtab === subtab.key }"
          @click="showTab(subtab)"
        >
          {{ subtab.name }}
        </div>
      </template>
    </div>
    <div
      v-else
      class="o-split-line o-split-line--tab"
    />
  </div>
</template>