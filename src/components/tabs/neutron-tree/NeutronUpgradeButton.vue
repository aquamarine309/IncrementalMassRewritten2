<script>
export default {
  name: "NeutronUpgradeButton",
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBought: false,
      canBeBought: false,
      branchBought: false
    };
  },
  computed: {
    styleObject() {
      return {
        "background-image": `url("./images/tree/${this.upgrade.formattedID}.png")`
      };
    },
    classObject() {
      return {
        "o-neutron-upgrade": true,
        "o-neutron-upgrade--available": this.canBeBought,
        "o-neutron-upgrade--selected": this.isSelected,
        "o-neutron-upgrade--bought": this.isBought,
        "o-neutron-upgrade--bought_quantum": this.isBought && this.isQuantum
      };
    },
    isSelected() {
      return this.$viewModel.selectedNodeId === this.upgrade.id;
    },
    isQuantum() {
      return this.upgrade.quantum;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.canBeBought = upgrade.canBeBought;
      this.isBought = upgrade.isBought;
      this.branchBought = upgrade.branchBought;
    },
    handleClick() {
      if (this.isSelected) {
        this.upgrade.purchase();
      } else {
        this.$viewModel.selectedNodeId = this.upgrade.id;
        GameUI.update();
      }
    }
  }
};
</script>

<template>
  <div
    v-if="branchBought || isBought"
    :class="classObject"
    :style="styleObject"
    @click="handleClick"
  />
</template>

<style scoped>
.o-neutron-upgrade {
  width: 40px;
  height: 40px;
  background-size: cover;
  position: absolute;
  border: 1px solid #444444;
  transform: translate(-50%, -50%);
  transition-duration: 0.2s;
  background-color: #171717;
}

.light-theme .o-neutron-upgrade {
  filter: invert(1) hue-rotate(180deg);
}

.ad-ui .o-neutron-upgrade {
  border-radius: 3px;
}

.o-neutron-upgrade--available {
  border-color: white;
}

.light-theme .o-neutron-upgrade--available {
  border-color: var(--color-supernova);
}

.o-neutron-upgrade--selected {
  width: 48px;
  height: 48px;
}

.o-neutron-upgrade--bought {
  border-color: #00520b;
}

.o-neutron-upgrade--bought_quantum {
  border-color: var(--color-quantum) !important;
}
</style>