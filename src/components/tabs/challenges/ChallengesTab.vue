<script>
import ChallengeBox from "./ChallengeBox";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ChallengesTab",
  components: {
    ChallengeBox,
    PrimaryButton
  },
  data() {
    return {
      page: 0
    };
  },
  computed: {
    challenges() {
      return Challenges.all.slice(this.page * 4, this.page * 4 + 4);
    },
    hasNextPage() {
      return Challenges.all.length >= this.page * 4 + 5 && Challenge(this.page * 4 + 5).isUnlocked;
    },
    hasPage2() {
      return this.page !== 0 || this.hasNextPage;
    },
    title() {
      return i18n.t(this.challenges[0].type.titleKey);
    }
  },
  methods: {
    update() {
      this.page = player.challenges.page;
    },
    toggleTo(page) {
      if (page < 0 || page > this.page && !this.hasNextPage) return;
      this.page = page;
      player.challenges.page = page;
    }
  }
};
</script>

<template>
  <div>
    <div
      v-if="hasPage2"
      class="c-page-row"
    >
      <PrimaryButton
        class="o-primary-btn--toggle-page"
        :enabled="page > 0"
        @click="toggleTo(page - 1)"
      >
        <i class="fas fa-arrow-left" />
      </PrimaryButton>
      <span class="o-challenge-page-title">{{ title }}</span>
      <PrimaryButton
        class="o-primary-btn--toggle-page"
        :enabled="hasNextPage"
        @click="toggleTo(page + 1)"
      >
        <i class="fas fa-arrow-right" />
      </PrimaryButton>
    </div>
    <div class="l-challenges-layout">
      <ChallengeBox
        v-for="challenge in challenges"
        :key="challenge.id"
        :challenge="challenge"
      />
    </div>
  </div>
</template>

<style scoped>
.o-primary-btn--toggle-page {
  width: 25px;
  height: 25px;
}

.o-challenge-page-title {
  font-weight: bold;
  margin: 0 20px;
  color: var(--color-accent);
  font-size: 16px;
}

.c-page-row {
  margin: 15px 0;
}
</style>