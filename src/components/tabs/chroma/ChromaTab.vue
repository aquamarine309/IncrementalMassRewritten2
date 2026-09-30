<script>
import Decimal from "break_eternity.js";
import ChromaItem from "./ChromaItem";

export default {
  name: "ChromaTab",
  components: {
    ChromaItem
  },
  data() {
    return {
      theories: new Decimal(0)
    };
  },
  computed: {
    chroma: () => Chroma
  },
  methods: {
    update() {
      this.theories = getQuantumTheories();
    }
  }
};
</script>

<template>
  <div>
    <div>{{ $tc("you_have_X_quantum_theory", checkSingle(theories), { value: theories }) }}</div>
    <ChromaItem
      v-for="item of chroma"
      :key="item.id"
      :chroma="item"
    />
  </div>
</template>

<style scoped>

</style>