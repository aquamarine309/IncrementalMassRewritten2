<script>
import AwayProgressEntry from "@/components/modals/AwayProgressEntry";
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "AwayProgressModal",
  components: {
    AwayProgressEntry,
    ModalWrapper,
  },
  props: {
    playerBefore: {
      type: Object,
      required: true,
    },
    playerAfter: {
      type: Object,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      somethingHappened: false,
    };
  },
  computed: {
    offlineStats() {
      return AwayProgressTypes.appearsInAwayModal;
    },
    headerText() {
      const timeDisplay = TimeSpan.fromSeconds(this.seconds).toString();
      if (!this.somethingHappened) {
        return `While you were away for ${timeDisplay}... Nothing happened.`;
      }
      return `While you were away for ${timeDisplay}: `;
    },
  },
};
</script>

<template>
  <ModalWrapper class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      {{ headerText }}
    </div>
    <div class="c-modal-away-progress__resources c-modal--short">
      <AwayProgressEntry
        v-for="name of offlineStats"
        :key="name"
        :name="name"
        :player-before="playerBefore"
        :player-after="playerAfter"
        @something-happened="somethingHappened = true"
      />
    </div>
    <span v-if="somethingHappened">Note: Click an entry to hide it in the future.</span>
  </ModalWrapper>
</template>

<style scoped>
.c-modal-away-progress__resources div {
  width: 100%;
  margin-bottom: 2px;
  padding-bottom: 2px;
  cursor: pointer;
}
</style>
