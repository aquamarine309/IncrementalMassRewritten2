<script>
import ModalWrapperChoice from "./ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapperChoice
  },
  methods: {
    reset() {
      GameStorage.hardReset();
      EventHub.ui.offAll(this);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice @confirm="reset">
    <div class="c-reset-title">
      Reset Game
    </div>
  </ModalWrapperChoice>
</template>