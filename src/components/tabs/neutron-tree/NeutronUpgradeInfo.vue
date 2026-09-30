<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "NeutronUpgradeInfo",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay
  },
  props: {
    upgrade: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      isSatisfied: false,
      isBought: false,
      reqRemoved: false
    };
  },
  computed: {
    requirement() {
      return this.config.requirement?.();
    },
    config() {
      return this.upgrade.config;
    },
    isQuantum() {
      return this.upgrade.quantum;
    }
  },
  methods: {
    update() {
      if (!this.upgrade) return;
      this.isBought = this.upgrade.isBought;
      this.isSatisfied = this.upgrade.isSatisfied;
      this.reqRemoved = this.upgrade.reqRemoved;
    }
  }
};
</script>

<template>
  <div class="c-neutron-upgrade-info">
    <div v-if="upgrade">
      <div v-if="!isBought">
        <span>(Click again to buy if affordable)</span>
        <span
          v-if="requirement && !reqRemoved"
          :class="isSatisfied ? 'c-green' : 'c-red'"
        >
          Requirement: {{ requirement }}
        </span>
      </div>
      <div class="c-sky">
        <span>[{{ upgrade.formattedID }}]</span>
        <DescriptionDisplay :config="config" />
      </div>
      <div>
        <CostDisplay
          :config="config"
          :name-key="isQuantum ? 'X_quantum_foam' : 'X_neutron_star'"
        />
      </div>
      <div class="c-green">
        <EffectDisplay :config="config" />
      </div>
    </div>
    <div v-else>
      (Click any tree upgrade to show)
    </div>
  </div>
</template>

<style scoped>
.c-neutron-upgrade-info {
  font-size: 12px;
  margin: 10px 0;
}
</style>