<script>
export default {
  name: "ScalingBox",
  props: {
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
      enrtyVisibilities: []
    };
  },
  computed: {
    allScaling: () => Scaling.all,
    expandClass() {
      return ["far", this.isExpanded ? "fa-minus-square" : "fa-plus-square"];
    },
    name() {
      return `${i18n.t(SCALING_TYPE[this.position])}${i18n.t("scaling")}`;
    },
    isAvailable() {
      return this.enrtyVisibilities.length !== 0;
    }
  },
  methods: {
    update() {
      const all = this.allScaling;
      this.enrtyVisibilities = all.filter(x => x.isScaled(this.position));
    },
    formatPenalty(value, position) {
      if ([0, 1, 2, 4, 5].includes(position)) {
        return `x<sup>${format(value)}</sup>`;
      }
      if ([3, 7].includes(position)) {
        return `${format(value)}<sup>x</sup>`;
      }
      if ([6, 8].includes(position)) {
        return `${formatInt(10)}<sup>log(x)<sup>${format(value)}</sup></sup>`;
      }
      return "Unknown scaling";
    }
  }
};
</script>

<template>
  <div
    v-if="isAvailable"
    class="l-scaling-info"
    @click="$emit('expand', position)"
  >
    <div>
      <span class="o-scaling-name">{{ name }}</span>
      <i :class="expandClass" />
    </div>
    <div
      v-if="isExpanded"
      class="c-scaling-container"
    >
      <div
        v-for="(scaling, index) in enrtyVisibilities"
        :key="index"
        class="o-scaling"
      >
        <div class="o-scaling-name--small">
          {{ scaling.name }}
        </div>
        <div>Starts at {{ format(scaling.scalings[position].start, 0) }}</div>
        <div>Scaling: <span v-html="formatPenalty(scaling.scalings[position].scale, position)" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-scaling-name {
  font-weight: bold;
  font-size: 16px;
  margin: 0 5px;
}

.o-scaling-name--small {
  font-weight: bold;
  font-size: 14px;
  margin: 0 5px;
}

.c-scaling-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.o-scaling {
  display: flex;
  flex-direction: column;
  margin: 6px 0;
}
</style>