<script>
import ScalingBox from "./ScalingBox";

export default {
  name: "ScalingTab",
  components: {
    ScalingBox
  },
  data() {
    return {
      expanded: 0
    };
  },
  computed: {
    count() {
      return SCALING_TYPE.length;
    }
  },
  methods: {
    isExpanded(id) {
      return (this.expanded & (1 << id)) !== 0;
    },
    expand(id) {
      if (this.isExpanded(id)) {
        this.expanded &= ~(1 << id);
      } else {
        this.expanded |= (1 << id);
      }
    }
  }
};
</script>

<template>
  <div>
    <ScalingBox
      v-for="index in count"
      :key="index"
      :is-expanded="isExpanded(index - 1)"
      :position="index - 1"
      @expand="expand(index - 1)"
    />
  </div>
</template>