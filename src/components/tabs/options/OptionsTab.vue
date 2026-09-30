<script>
import PrimaryButton from "@/components/PrimaryButton";
import ButtonCycle from "@/components/ButtonCycle";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "OptionsTab",
  components: {
    PrimaryButton,
    PrimaryToggleButton,
    ButtonCycle
  },
  data() {
    return {
      starUnlocked: false,
      starBG: false,
      adUI: false,
      language: "en",
      foldUselessRank: false,
      darkTheme: true,
      massDisplay: MASS_DISPLAY.DEFAULT,
      particle: false,
      iconifyTab: false
    };
  },
  computed: {
    massDisplayLabels() {
      return [
        i18n.t("default"),
        i18n.t("always_show_g"),
        i18n.t("always_show_mlt"),
        i18n.t("important_units_only")
      ];
    }
  },
  watch: {
    starBG(value) {
      player.options.starBG = value;
    },
    adUI(value) {
      player.options.adUI = value;
    },
    foldUselessRank(value) {
      player.options.foldUselessRank = value;
    },
    darkTheme(value) {
      player.options.darkTheme = value;
    },
    language(value) {
      EventHub.dispatch(GAME_EVENT.FORMAT_CHANGED);
      player.options.language = value;
      i18n.locale = value;
    },
    massDisplay(value) {
      EventHub.dispatch(GAME_EVENT.FORMAT_CHANGED);
      player.options.massDisplay = value;
    },
    particle(value) {
      C16.isActive = value;
    },
    iconifyTab(value) {
      player.options.iconifyTab = value;
    }
  },
  methods: {
    update() {
      const options = player.options;
      this.starUnlocked = Stars.isUnlocked;
      this.starBG = options.starBG;
      this.adUI = options.adUI;
      this.foldUselessRank = options.foldUselessRank;
      this.language = options.language;
      this.massDisplay = options.massDisplay;
      this.darkTheme = options.darkTheme;
      this.particle = C16.isActive;
      this.iconifyTab = options.iconifyTab;
    },
    toggleLanguage() {
      switch (this.language) {
        case "zh":
          this.language = "en";
          break;
        case "en":
          this.language = "zh";
          break;
        default:
          throw new Error("Unexpected Language");
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="c-options-title">
      Save & Load
    </div>
    <div class="l-options-row">
      <PrimaryButton
        class="c-options-btn"
        onclick="GameStorage.save()"
      >
        {{ $t("save_game") }}
      </PrimaryButton>
      <PrimaryButton
        class="c-options-btn"
        onclick="GameStorage.exportToClipboard()"
      >
        {{ $t("export_save") }}
      </PrimaryButton>
      <PrimaryButton
        class="c-options-btn"
        onclick="Modal.import.show()"
      >
        {{ $t("import_save") }}
      </PrimaryButton>
    </div>
    <div class="l-options-row">
      <PrimaryButton
        class="c-options-btn"
        onclick="GameStorage.exportAsOldVersion()"
      >
        {{ $t("export_to_old") }}
      </PrimaryButton>
      <PrimaryButton
        class="c-options-btn"
        onclick="Modal.hardReset.show()"
      >
        {{ $t("hard_reset") }}
      </PrimaryButton>
    </div>
    <br>
    <div class="c-options-title">
      Visual
    </div>
    <div class="l-options-row">
      <ButtonCycle
        v-model="massDisplay"
        :labels="massDisplayLabels"
        class="o-primary-btn c-options-btn"
        i18n-key="mass_display_X"
      />
      <PrimaryToggleButton
        v-model="adUI"
        class="c-options-btn"
        i18n-key="ad_ui_X"
      />
      <PrimaryButton
        class="c-options-btn"
        @click="toggleLanguage"
      >
        {{ $t("language_X", { language: $t("this_language") }) }}
      </PrimaryButton>
    </div>
    <div class="l-options-row">
      <PrimaryToggleButton
        v-model="darkTheme"
        class="c-options-btn"
        i18n-key="dark_theme_X"
      />
      <PrimaryToggleButton
        v-model="foldUselessRank"
        class="c-options-btn"
        i18n-key="collapse_fully_upgraded_rank_X"
      />
      <PrimaryToggleButton
        v-model="particle"
        class="c-options-btn"
        i18n-key="particle_bg_X"
      />
    </div>
    <div class="l-options-row">
      <PrimaryToggleButton
        v-model="iconifyTab"
        class="c-options-btn"
        i18n-key="icon_tab_X"
      />
      <PrimaryToggleButton
        v-if="starUnlocked"
        v-model="starBG"
        class="c-options-btn"
        i18n-key="show_star_X"
      />
    </div>
  </div>
</template>

<style scoped>
.c-options-title {
  font-size: 13px;
  margin-bottom: 4px;
  width: 100%;
  text-align: left;
}

.l-options-row {
  display: flex;
  flex-direction: row;
  margin: 2px 0;
}

.c-options-btn {
  width: calc(100% / 3 - 4px);
  padding: 1px;
  margin: 2px;
  height: 55px;
}
</style>