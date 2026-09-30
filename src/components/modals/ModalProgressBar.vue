<script>
import OfflineSpeedupButton from "@/components/OfflineSpeedupButton";

export default {
  name: "ModalProgressBar",
  components: {
    OfflineSpeedupButton,
  },
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remainingTime() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      const ms = timeSinceStart * (this.progress.max - this.progress.current) / this.progress.current;
      return TimeSpan.fromMilliseconds(ms).toStringShort();
    },
    buttons() {
      return this.progress.buttons || [];
    }
  },
};
</script>

<template>
  <div
    class="l-background-overlay"
  >
    <div class="c-modal">
      <div class="modal-progress-bar">
        <div class="modal-progress-bar__label">
          {{ progress.label }}
        </div>
        <div class="modal-progress-bar__margin">
          <div>
            {{ formatInt(progress.current) }}/{{ formatInt(progress.max) }} ticks done
          </div>
          <div>
            Time left: {{ remainingTime }}
          </div>
          <div class="modal-progress-bar__hbox">
            <div class="modal-progress-bar__bg">
              <div
                class="modal-progress-bar__fg"
                :style="foregroundStyle"
              />
            </div>
          </div>
        </div>
        <div class="modal-progress-bar__buttons">
          <OfflineSpeedupButton
            v-for="(button, id) in buttons"
            :key="id"
            :button="button"
            :progress="progress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-modal {
  position: fixed;
  /* stylelint-disable-next-line unit-allowed-list */
  top: 50vh;
  /* stylelint-disable-next-line unit-allowed-list */
  left: 50vw;
  transform: translate(-50%, -50%);
  width: 95%;
}

.modal-progress-bar {
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 3;
  justify-content: space-between;
  align-items: center;
}

.modal-progress-bar__hbox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.modal-progress-bar__bg {
  width: 100%;
  height: 4px;
  background: black;
  border: 1px solid white;
  margin-top: 3px;
}

.modal-progress-bar__fg {
  height: 100%;
  background: #888888;
}

.light-theme .modal-progress-bar__bg {
  background: #bbbbbb;
  border: none;
}

.light-theme .modal-progress-bar__fg {
  background: #dd1860;
}

.modal-progress-bar__buttons {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.modal-progress-bar__label {
  font-size: 15px;
  padding-bottom: 5px;
  font-weight: bold;
}

.modal-progress-bar__margin {
  width: 100%;
  margin: 10px 0;
}
</style>
