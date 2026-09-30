<script>
import NeutronUpgradeButton from "./NeutronUpgradeButton";
import NeutronUpgradeConnection from "./NeutronUpgradeConnection";

export default {
  name: "NeutronTreeLayout",
  components: {
    NeutronUpgradeButton,
    NeutronUpgradeConnection
  },
  props: {
    treeId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      now: Date.now()
    };
  },
  computed: {
    tree() {
      return NeutronTree[this.treeId];
    },
    upgrades() {
      return this.tree.upgrades;
    },
    connections() {
      return NeutronUpgradeConnections.filter(x => this.upgrades.includes(x[0]));
    }
  },
  watch: {
    treeId() {
      this.updateSize();
    }
  },
  mounted() {
    this.updateSize();
  },
  methods: {
    update() {
      this.now = Date.now();
    },
    updateSize() {
      const overlay = this.$refs.overlay;
      const layout = this.$refs.layout;
      overlay.scrollLeft = (layout.scrollWidth - overlay.clientWidth) / 2;
    },
    styleObject(upgrade) {
      return {
        left: `${upgrade.pos[0]}px`,
        top: `${upgrade.pos[1]}px`
      };
    }
  }
};
</script>

<template>
  <div
    ref="overlay"
    class="l-neutron-tree-overlay"
  >
    <div
      ref="layout"
      class="l-neutron-tree"
    >
      <svg class="l-neutron-tree-svg">
        <NeutronUpgradeConnection
          v-for="(connection, index) in connections"
          :key="index + 'connection'"
          :connection="connection"
          :time="now"
        />
      </svg>
      <NeutronUpgradeButton
        v-for="upgrade in upgrades"
        :key="upgrade.id"
        :upgrade="upgrade"
        :style="styleObject(upgrade)"
      />
    </div>
  </div>
</template>

<style scoped>
.l-neutron-tree-overlay {
  width: 100%;
  height: 500px;
  margin-top: 50px;
  overflow-x: auto;
}

.l-neutron-tree {
  width: 500px;
  height: 100%;
  position: relative;
}

.l-neutron-tree-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>