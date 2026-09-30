<script>
import Decimal from "break_eternity.js";
import QuantumMilestoneBox from "./QuantumMilestoneBox";

export default {
  name: "QuantumMilestonesTab",
  components: {
    QuantumMilestoneBox
  },
  data() {
    return {
      quantizes: new Decimal()
    };
  },
  computed: {
    milestones: () => QuantumMilestones.all,
    rows() {
      return Math.ceil(this.milestones.length / 2);
    }
  },
  methods: {
    update() {
      this.quantizes.copyFrom(Currency.quantizes.value);
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 2 + column - 1];
    }
  }
};
</script>

<template>
  <div>
    <div>You Qualized {{ format(quantizes, 0) }} times.</div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-quantum-milestone-row"
    >
      <QuantumMilestoneBox
        v-for="column in 2"
        :key="row * 2 + column"
        :get-milestone="getMilestone(row, column)"
      />
    </div>
  </div>
</template>

<style scoped>
.l-quantum-milestone-row {
  display: flex;
  margin: 5px 0;
  flex-direction: row;
  width: 100%;
  height: auto;
}
</style>