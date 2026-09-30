<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";

export default {
  name: "RankBox",
  components: {
    DescriptionDisplay,
    EffectDisplay
  },
  props: {
    rank: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isAvailable: false,
      enrtyVisibilities: []
    };
  },
  computed: {
    expandClass() {
      return ["far", this.isExpanded ? "fa-minus-square" : "fa-plus-square"];
    },
    name() {
      return this.rank.name;
    },
    unlocks() {
      return Object.values(this.rank.unlocks);
    }
  },
  methods: {
    update() {
      const rank = this.rank;
      this.isAvailable = rank.isUnlocked && rank.amount.gt(0);
      this.enrtyVisibilities = this.unlocks.map(unlock => unlock.canBeApplied);
    }
  }
};
</script>

<template>
  <div
    v-if="isAvailable"
    class="l-rank-info"
    @click="$emit('expand', position)"
  >
    <div>
      <span class="o-rank-name">{{ rank.name }}</span>
      <i :class="expandClass" />
    </div>
    <div
      v-if="isExpanded"
      class="c-rank-unlock-container"
    >
      <template v-for="(unlock, index) in unlocks">
        <div
          v-if="enrtyVisibilities[index]"
          :key="unlock.id"
          class="o-rank-unlock"
        >
          <div class="o-rank-name--small">
            {{ name }} {{ format(unlock.requirement, 0) }}
          </div>
          <DescriptionDisplay :config="unlock.config" />
          <EffectDisplay :config="unlock.config" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.o-rank-name {
  font-weight: bold;
  font-size: 16px;
  margin: 0 5px;
}

.o-rank-name--small {
  font-weight: bold;
  font-size: 14px;
  margin: 0 5px;
}

.c-rank-unlock-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.o-rank-unlock {
  display: flex;
  flex-direction: column;
  margin: 6px 0;
}
</style>