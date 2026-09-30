<script>
import RankBox from "./RankBox";

export default {
  name: "RankRewardsTab",
  components: {
    RankBox
  },
  data() {
    return {
      expanded: 0
    };
  },
  computed: {
    ranks() {
      return RankType.all;
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
    <RankBox
      v-for="(rank, index) in ranks"
      :key="rank.id"
      :is-expanded="isExpanded(index)"
      :rank="rank"
      :position="index"
      @expand="expand(index)"
    />
  </div>
</template>