<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "QuantumChallengeBox",
  components: {
    DescriptionDisplay,
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
      mod: 0,
      maxMod: 0,
      isActive: false
    };
  },
  computed: {
    config() {
      return this.challenge.config;
    },
    id() {
      return this.config.id;
    },
    name() {
      return this.challenge.name;
    },
    styleObject() {
      return {
        "background-image": `url("./images/challenges/qcm${this.challenge.id}.png")`
      };
    }
  },
  watch: {
    mod(value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.challenge.mod = value;
    }
  },
  methods: {
    update() {
      this.mod = this.challenge.mod;
      this.maxMod = QuantumChallenges.maxMod;
      this.isActive = QuantumChallenges.isActive;
    },
    add(value) {
      if (this.isActive) return;
      if (this.mod + value < 0 || this.mod + value > this.maxMod) return;
      this.mod += value;
    }
  }
};
</script>

<template>
  <div class="o-challenge-box">
    <div class="o-challenge-id-concer">
      {{ id + 1 }}
    </div>
    <div class="o-challenge-image-and-title-row">
      <div
        :style="styleObject"
        class="c-challenge-image"
      />
      <div class="c-challenge-info">
        <div class="c-challenge-name">
          {{ name }}
        </div>
        <div class="c-challenge-mod-container">
          <div class="c-challenge-mod">
            Current Mod:
          </div>
          <PrimaryButton
            v-if="!isActive"
            :enabled="mod > 0"
            @click="add(-1)"
          >
            <i class="fas fa-minus" />
          </PrimaryButton>
          <div class="c-challenge-mod">
            {{ formatInt(mod) }} / {{ formatInt(maxMod) }}
          </div>
          <PrimaryButton
            v-if="!isActive"
            :enabled="mod < maxMod"
            @click="add(1)"
          >
            <i class="fas fa-add" />
          </PrimaryButton>
        </div>
      </div>
    </div>
    <div>
      <DescriptionDisplay
        class="c-challenge-description"
        :config="config"
      />
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
  position: relative;
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
  filter: invert(1) hue-rotate(180deg);
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

.c-challenge-mod-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}

.c-challenge-mod-container .o-primary-btn {
  width: 22px;
  height: 22px;
  font-weight: bold;
  line-height: 11px;
}

.c-challenge-mod {
  color: var(--color-accent);
  font-size: 15px;
  margin: 0 8px;
}

.o-challenge-id-concer {
  position: absolute;
  font-size: 45px;
  font-weight: bold;
  opacity: 10%;
  top: 0;
  right: 10px;
}
</style>