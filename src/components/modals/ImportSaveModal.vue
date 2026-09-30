<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ImportSaveModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: ""
    };
  },
  computed: {
    saveCheckString() {
      const save = Serializer.decode(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? Serializer.decode(this.input) : undefined;
    },
    fileName() {
      return this.player.options.saveFileName;
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    isFromFuture() {
      return this.player.lastUpdate > Date.now();
    },
    lastOpened() {
      const ms = Date.now() - this.player.lastUpdate;
      return this.isFromFuture
        ? `This save is from ${TimeSpan.fromMilliseconds(-ms).toString()} in the future.`
        : `This save was last opened ${TimeSpan.fromMilliseconds(ms).toString()} ago.`;
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      GameStorage.importSave(this.input);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      Input your save
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <template v-if="inputIsValidSave">
        <div v-if="fileName">
          File name: {{ fileName }}
        </div>
        <div>Mass: {{ formatMass(player.mass) }}</div>
        <div class="c-modal-import__warning">
          (Your current save file will be overwritten!)
        </div>
        <br>
        <div>
          {{ lastOpened }}
        </div>
      </template>
      <div v-else-if="hasInput">
        Not a valid save:
        <br>
        {{ saveCheckString }}
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      Import
    </PrimaryButton>
  </ModalWrapperChoice>
</template>