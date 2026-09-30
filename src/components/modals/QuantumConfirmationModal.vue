<script>
import ModalWrapperChoice from "./ModalWrapperChoice";

export default {
  name: "QuantumConfirmationModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    confirm() {
      Resets.quantum.resetLayer();
      EventHub.ui.offAll(this);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirm">
    <div class="c-reset-title">
      ARE YOU SURE ABOUT IT???
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-reset-title {
  font-weight: bold;
  font-size: 16px;
  margin: 6px 0;
}
</style>