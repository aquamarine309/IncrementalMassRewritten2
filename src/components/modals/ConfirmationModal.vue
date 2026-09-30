<script>
import ModalWrapperChoice from "./ModalWrapperChoice";

export default {
  name: "ConfirmationModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    confirmFn: {
      type: Function,
      required: true
    },
    option: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false,
      default: ""
    }
  },
  methods: {
    confirm() {
      this.confirmFn();
      EventHub.ui.offAll(this);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    :option="option"
    @confirm="confirm"
  >
    <div class="c-reset-title">
      Are you sure you want to reset?
    </div>
    <div v-if="text">
      {{ text }}
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