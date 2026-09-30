<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SupernovaOverlay",
  components: {
    PrimaryButton
  },
  methods: {
    reset() {
      Resets.supernova.resetLayer();
      Tab.supernova.neutron_tree.show();
    }
  }
};
</script>

<template>
  <div class="l-supernova-overlay">
    <h2>You have become SUPERNOVA!</h2>
    <h4>But will reset everything, and gain SUPERNOVA!</h4>
    <h4>You can pass it...</h4>
    <h3>... to discover!</h3>
    <br>
    <PrimaryButton @click="reset">
      You'll be Supernova...
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-supernova-overlay {
  margin-top: 10px;
  line-height: 130%;
}
</style>