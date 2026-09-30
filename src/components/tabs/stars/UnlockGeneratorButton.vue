<script>
import Decimal from "break_eternity.js";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "UnlockGeneratorButton",
  components: {
    PrimaryButton
  },
  data() {
    return {
      hasNext: false,
      cost: new Decimal(),
      canBeUnlocked: false
    };
  },
  methods: {
    update() {
      const next = StarGenerators.next;
      this.hasNext = next !== undefined;
      if (!this.hasNext) return;
      this.cost = next.cost;
      this.canBeUnlocked = next.canBeUnlocked;
    },
    unlock() {
      StarGenerators.next.unlock();
    }
  }
};
</script>

<template>
  <PrimaryButton
    v-if="hasNext"
    :enabled="canBeUnlocked"
    class="o-unlock-star-btn"
    @click="unlock"
  >
    Unlock new type of Stars, require {{ format(cost) }} Quark
  </PrimaryButton>
</template>

<style scoped>
.o-unlock-star-btn {
  width: 180px;
  padding: 5px;
}
</style>