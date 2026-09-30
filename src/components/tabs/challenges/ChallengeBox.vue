<script>
import Decimal from "break_eternity.js";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ChallengeBox",
  components: {
    DescriptionDisplay,
    EffectDisplay,
    PrimaryButton
  },
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      completions: new Decimal(),
      isRunning: false,
      max: new Decimal(),
      goal: new Decimal(),
      pendingCompletions: new Decimal(),
      isUnlocked: false,
      isCapped: false,
      forceRunning: false
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    reward() {
      return this.challenge.reward.config;
    },
    name() {
      return `${this.challenge.name} (${format(this.completions, 0)} / ${format(this.max, 0)})`;
    },
    resetType() {
      return i18n.t(this.config.type.resetKey);
    },
    buttonText() {
      if (this.isRunning) {
        if (this.pendingCompletions.gt(this.completions)) {
          return i18n.t("X_times", { value: formatPlus(this.pendingCompletions.minus(this.completions), 0) });
        }
        return i18n.t("exit");
      }
      if (this.forceRunning) {
        return i18n.t("running");
      }
      return i18n.t("enter_challenge");
    },
    nameClass() {
      return {
        "c-challenge-name": true,
        "c-challenge-name--small": this.name.length > 30
      };
    },
    goalText() {
      return this.config.type.formatGoal(this.goal);
    },
    milestones() {
      return this.challenge.milestones;
    },
    imgClass() {
      return {
        "c-challenge-image": true,
        "c-challenge-image--completed": this.isCapped,
        "c-challenge-image--running": this.isRunning
      };
    },
    styleObject() {
      return {
        "background-image": `url("./images/challenges/${this.challenge.id}.png")`
      };
    }
  },
  methods: {
    update() {
      const challenge = this.challenge;
      this.isUnlocked = challenge.isUnlocked;
      if (!this.isUnlocked) return;
      this.goal = challenge.goal;
      this.max = challenge.max;
      this.isRunning = challenge.isRunning;
      this.forceRunning = challenge.forceRunning;
      this.completions.copyFrom(challenge.completions);
      this.isCapped = challenge.isCapped;
      if (!this.isRunning) return;
      this.pendingCompletions.copyFrom(challenge.pendingCompletions);
    },
    enter() {
      if (this.isRunning) {
        this.challenge.exit();
      } else {
        this.challenge.start();
      }
    },
    restart() {
      this.challenge.exit();
      this.challenge.start();
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="o-challenge-box"
  >
    <div class="o-challenge-image-and-title-row">
      <div
        :style="styleObject"
        :class="imgClass"
      />
      <div class="c-challenge-info">
        <div :class="nameClass">
          {{ name }}
        </div>
        <div class="o-challenge-buttons">
          <PrimaryButton @click="enter">
            {{ buttonText }}
          </PrimaryButton>
          <PrimaryButton
            v-if="isRunning"
            @click="restart"
          >
            {{ $t("restart") }}
          </PrimaryButton>
        </div>
      </div>
    </div>
    <div>
      <DescriptionDisplay
        class="c-challenge-description"
        :config="config"
      />
      <br>
      <span class="c-challenge-description">{{ resetType }}</span>
      <br>
      <span>{{ $t("goal_X", { value: goalText }) }}</span>
      <br>
      <EffectDisplay
        class="c-challenge-effect"
        :config="config"
      />
      <DescriptionDisplay
        class="c-green"
        :config="reward"
        title-key="reward_X"
        br
      />
      <EffectDisplay
        class="c-green"
        :config="reward"
        br
      />
      <div
        v-for="(milestone, index) in milestones"
        :key="index"
      >
        <DescriptionDisplay
          class="c-yellow"
          :config="milestone.config"
          br
        />
        <EffectDisplay
          class="c-yellow"
          :config="milestone.config"
          br
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.o-challenge-box {
  display: flex;
  width: 100%;
  padding: 5px 10px;
  flex-direction: column;
  padding: 5px;
  border: 1px solid white;
  margin: 5px 0;
  background: linear-gradient(305deg, #232225, #1e1d1f, #111111);
}

.light-theme .o-challenge-box {
  background: #f6f6f6;
  border-color: #1b1a1e;
}

.ad-ui .o-challenge-box {
  border-radius: 5px;
}

.c-challenge-image {
  width: 70px;
  height: 70px;
  background-size: cover;
}

.light-theme .c-challenge-image {
  background-color: rgba(0, 0, 0, 0.1);
}

.c-challenge-image--running {
  background-color: #444444;
}

.light-theme .c-challenge-image--running {
  box-shadow: inset 0 0 10px 2px #fc8c65;
}

.c-challenge-image--completed {
  background-color: var(--color-bought) !important;
}

.o-challenge-image-and-title-row {
  display: flex;
  width: 100%;
  height: 80px;
}

.c-challenge-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 3px 8px;
}

.c-challenge-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px black;
}

.light-theme .c-challenge-name {
  text-shadow: 1px 1px 3px white;
  color: black;
}

.c-challenge-name--small {
  font-size: 15px;
}

.c-challenge-description {
  color: red;
}

.o-challenge-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.o-challenge-buttons .o-primary-btn {
  flex: 1;
  margin: 0 5px;
  padding: 8px 0;
}
</style>