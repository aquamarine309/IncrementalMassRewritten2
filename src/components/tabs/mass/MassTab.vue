<script>
import RankButton from "./RankButton";
import MassUpgradeRow from "@/components/MassUpgradeRow";
import MassSoftcapRow from "./MassSoftcapRow";
import SimpleRankRow from "./SimpleRankRow";

export default {
  name: "MassTab",
  components: {
    RankButton,
    MassUpgradeRow,
    MassSoftcapRow,
    SimpleRankRow
  },
  data() {
    return {
      ragePowersUnlocked: false,
      buttonRanks: [],
      foldRanks: []
    };
  },
  computed: {
    rankRows() {
      const ranks = this.buttonRanks;
      const result = [];
      const isOdd = ranks.length % 2 !== 0;
      for (let i = 0; i + 1 < ranks.length; i += 2) {
        result.push([ranks[i], ranks[i + 1]]);
      }
      if (isOdd) {
        result.push([ranks.last()]);
      }
      return result;
    },
    mainUpgrades() {
      return [
        MassUpgrade.muscler,
        MassUpgrade.booster,
        MassUpgrade.stronger,
        MassUpgrade.overpower
      ];
    },
    secondUpgrades() {
      return [
        MassUpgrade.tickspeed
      ];
    },
    softcaps() {
      return MassSoftcap;
    }
  },
  methods: {
    update() {
      this.ragePowersUnlocked = PlayerProgress.rageUnlocked();
      if (player.options.foldUselessRank) {
        this.foldRanks = [];
        this.buttonRanks = [];
        for (const rank of RankType.all) {
          if (rank.nextUnlock.value === undefined || rank.isDisabled) {
            this.foldRanks.push(rank);
          } else {
            this.buttonRanks.push(rank);
          }
        }
      } else {
        this.buttonRanks = RankType.all;
        this.foldRanks = [];
      }
    }
  }
};
</script>

<template>
  <div>
    <div
      v-for="(ranks, index) in rankRows"
      :key="index + 'rank'"
      class="l-rank-row"
    >
      <RankButton :rank="ranks[0]" />
      <RankButton
        v-if="ranks.length === 2"
        :rank="ranks[1]"
      />
    </div>
    <div
      v-if="foldRanks.length > 0"
      class="l-fold-ranks-container"
    >
      <SimpleRankRow
        v-for="rank in foldRanks"
        :key="rank.name"
        :rank="rank"
      />
    </div>
    <MassUpgradeRow
      v-for="upgrade in mainUpgrades"
      :key="upgrade.name"
      :upgrade="upgrade"
    />
    <div
      v-if="ragePowersUnlocked"
      class="c-second-upgrades"
    >
      <MassUpgradeRow
        v-for="upgrade in secondUpgrades"
        :key="upgrade.name"
        :upgrade="upgrade"
      />
    </div>
    <div>
      <MassSoftcapRow
        v-for="softcap in softcaps"
        :key="softcap.id"
        :softcap="softcap"
      />
    </div>
  </div>
</template>

<style scoped>
.c-second-upgrades {
  margin-top: 40px;
}

.l-fold-ranks-container {
  margin: 8px 0;
}
</style>