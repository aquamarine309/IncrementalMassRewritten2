<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "QuantumMilestoneBox",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    times() {
      return this.milestone.requirement;
    },
    config() {
      return this.milestone.config;
    },
    classObject() {
      return {
        "o-quantum-milestone-box": true,
        "o-quantum-milestone-box--reached": this.isReached
      };
    }
  },
  methods: {
    update() {
      if (!this.milestone) return;
      this.isReached = this.milestone.isReached;
    }
  }
};
</script>

<template>
  <div
    v-if="milestone"
    :class="classObject"
  >
    <span>{{ format(times, 0) }} Quantizes</span>
    <DescriptionDisplay :config="config" />
    <EffectDisplay :config="config" />
  </div>
</template>

<style scoped>
.o-quantum-milestone-box {
  margin: 0 2px;
  flex: 1;
  background: #909090;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 6px 4px;
  border: 1px solid black;
  font-weight: bold;
  font-size: 11px;
}

.ad-ui .o-quantum-milestone-box {
  border-radius: 3px;
}

.o-quantum-milestone-box--reached {
  background: #106f15;
  border-color: var(--color-quantum);
  color: var(--color-quantum);
}

.light-theme .o-quantum-milestone-box--reached {
  background: #80d590;
  color: black;
}
</style>