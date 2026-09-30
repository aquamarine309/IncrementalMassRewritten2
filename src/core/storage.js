import { DEV } from "@/env";
import { deepmergeAll } from "@/utility/deepmerge";
import { migrations } from "./migrations";

/* eslint-disable camelcase */
export const GameStorage = {
  saveInterval: 2e4,

  get timeSinceLastSave() {
    return this._timeSinceLastSave;
  },

  set timeSinceLastSave(value) {
    this._timeSinceLastSave = value;
    if (this._timeSinceLastSave >= this.saveInterval) {
      this.save();
    }
  },

  get saveKey() {
    return DEV ? "imrr-dev-save" : "imrr-save";
  },

  init() {
    const localSave = localStorage.getItem(this.saveKey);
    if (localSave === null) {
      this.updatePlayerData();
    } else {
      this.importSave(localSave);
    }
    setInterval(() => this.save(), this.saveInterval);
  },

  importFromJSON(json) {
    GameLoop.stop();
    const playerObject = json;
    player = migrations.patchPlayer(playerObject);
    this.updatePlayerData();
  },

  exportToClipboard() {
    copyToClipboard(Serializer.encode(JSON.stringify(player)));
    GameUI.notify.info(i18n.t("export_save_to_clipboard"));
  },

  importSave(save) {
    try {
      this.importFromJSON(Serializer.decode(save));
    } catch (e) {
      Modal.message.show(`Invalid save.`);
      console.log(e);
    }
  },

  get canSave() {
    return Supernova.times.gt(0) || !Resets.supernova.canReset;
  },

  save() {
    if (!this.canSave) return;
    localStorage.setItem(this.saveKey, Serializer.encode(JSON.stringify(player)));
    this._timeSinceLastSave = 0;
    this.hasSaved = true;
  },

  hardReset() {
    player = deepmergeAll([{}, Player.defaultStart]);
    player.lastUpdate = Date.now();
    this.save();
    this.updatePlayerData();
  },

  updatePlayerData() {
    Lazy.invalidateAll();
    i18n.locale = player.options.language;
    const diff = Date.now() - player.lastUpdate;
    if (diff > 1e4) {
      simulateTime(diff / 1000);
    } else {
      GameLoop.restart();
      this.save();
    }
  },

  // Some minimal save verification; if the save is valid then this returns an empty string, otherwise it returns a
  // a string roughly stating what's wrong with the save. In order for importing to work properly, this must return
  // an empty string.
  checkPlayerObject(save) {
    // Sometimes save is the output of GameSaveSerializer.deserialize, and if that function fails then it will result
    // in the input parameter here being undefined
    if (save === undefined || save === null) return "Save decoding failed (invalid format)";
    // Right now all we do is check for the existence of an mass prop, but if we wanted to do further save
    // verification then here's where we'd do it
    if (save.mass === undefined) return "Save does not have mass property";

    // Recursively check for any NaN props and add any we find to an array
    const invalidProps = [];
    function checkNaN(obj, path) {
      let hasNaN = false;
      for (const key in obj) {
        const prop = obj[key];
        let thisNaN;
        switch (typeof prop) {
          case "object":
            thisNaN = checkNaN(prop, `${path}.${key}`);
            hasNaN = hasNaN || thisNaN;
            break;
          case "number":
            thisNaN = Number.isNaN(prop);
            hasNaN = hasNaN || thisNaN;
            if (thisNaN) invalidProps.push(`${path}.${key}`);
            break;
          case "string":
            // If we're attempting to import, all NaN entries will still be strings
            thisNaN = prop === "NaN";
            hasNaN = hasNaN || thisNaN;
            if (thisNaN) invalidProps.push(`${path}.${key}`);
            break;
        }
      }
      return hasNaN;
    }
    checkNaN(save, "player");

    if (invalidProps.length === 0) return "";
    return `${quantify("NaN player property", invalidProps.length)} found:
      ${invalidProps.join(", ")}`;
  },

  exportAsOldVersion() {
    const save = {};
    save.mass = player.mass;
    save.ranks = player.ranks;
    save.time = Date.now() - player.records.gameCreatedTime;

    const massUpg = player.massUpgrades;
    save.massUpg = [
      null,
      massUpg.muscler,
      massUpg.booster,
      massUpg.stronger,
      massUpg.overpower
    ];
    save.tickspeed = massUpg.tickspeed;
    const mainUpg = player.mainUpgrades;
    save.mainUpg = {
      rp: convertBitsToArray(mainUpg.rage, 1),
      bh: convertBitsToArray(mainUpg.blackHole, 1),
      atom: convertBitsToArray(mainUpg.atom, 1),
    };
    save.rp = {
      points: player.ragePowers,
      unl: player.unlocks.ragePower
    };

    const auto = player.auto;
    save.autoMassUpg = [
      null,
      auto.massUpgrades.muscler,
      auto.massUpgrades.booster,
      auto.massUpgrades.stronger,
      auto.massUpgrades.overpower
    ];

    save.bh = {
      mass: player.blackHole,
      dm: player.darkMatter,
      condenser: massUpg.condenser,
      unl: player.unlocks.darkMatter,
      autoCondenser: auto.massUpgrades.condenser
    };

    const confirm = player.options.confirmations;
    save.confirms = {
      rp: confirm.ragePower,
      bh: confirm.darkMatter,
      atom: confirm.atom,
      sn: confirm.supernova
    };

    save.autoTickspeed = auto.massUpgrades.tickspeed;
    save.auto_ranks = auto.ranks;
    save.auto_mainUpg = {
      rp: auto.mainUpgrades.rage,
      bh: auto.mainUpgrades.blackHole,
      atom: auto.mainUpgrades.atom
    };

    const challenges = player.challenges;
    const completions = {};
    for (let i = 0; i < challenges.completions.length; i++) {
      completions[i + 1] = challenges.completions[i];
    }
    save.chal = {
      active: challenges.current,
      comps: completions,
      choosed: 0,
      unl: Challenges.isUnlocked
    };

    save.atom = {
      atomic: player.atomicPower,
      auto_gr: auto.massUpgrades.cosmicRay,
      gamma_ray: massUpg.cosmicRay,
      unl: player.unlocks.atom,
      points: player.atoms,
      powers: player.particlePowers,
      quarks: player.quark,
      particles: player.particles,
      dTatio: player.particleWeights,
      ratio: player.ratioMode,
      elements: Array.from(player.elements)
    };

    const dilation = player.dilation;
    save.md = {
      active: dilation.active,
      mass: dilation.mass,
      particles: dilation.particles,
      upgs: dilation.upgrades
    };

    const stars = player.stars;
    save.stars = {
      points: stars.amount,
      generators: stars.generators,
      boost: massUpg.starBooster,
      unls: stars.unlocked + 1
    };

    const supernova = player.supernova;
    const bosons = supernova.bosons;
    const fermions = supernova.fermions;
    const radiation = supernova.radiation;
    save.supernova = {
      times: supernova.times,
      stars: supernova.stars,
      tree: Array.from(supernova.tree).map(x => x.replace(/[A-Z]/gu, matched => `_${matched.toLowerCase()}`)),
      post_10: !Supernova.tutorialActive,
      bosons: {
        gluon: bosons.gluon,
        graviton: bosons.graviton,
        hb: bosons.higgsBoson,
        neg_w: bosons.negativeW,
        pos_w: bosons.positiveW,
        photon: bosons.photon,
        z_boson: bosons.zBoson
      },
      b_upgs: supernova.bosonUpgrades,
      fermions: {
        choosed: `${Math.floor(fermions.active / 6)}${fermions.active % 6}`,
        points: [fermions.quarks, fermions.leptons],
        tiers: [fermions.tiers.slice(0, 6), fermions.tiers.slice(6, 12)],
        unl: Fermions.areUnlocked
      },
      radiation: {
        hz: radiation.frequency,
        ds: radiation.unlocks.map(x => x.distance),
        bs: radiation.unlocks.reduce((acc, x) => acc.concat([x.amplitude, x.velocity]), [])
      }
    };

    const quantum = player.quantum;
    const qc = quantum.challenges;
    save.qu = {
      reached: quantum.times.gt(0),
      times: quantum.times,
      chr_get: convertBitsToArray(quantum.chromaState),
      chroma: quantum.chroma,
      points: quantum.foam,
      cosmic_str: massUpg.cosmicString,
      bp: quantum.blueprint,
      auto: {
        enabled: auto.quantum.isActive,
        mode: auto.quantum.mode,
        input: auto.quantum.mode === AUTO_QUANTUM_TYPE.AMOUNT ? auto.quantum.amount.toString() : auto.quantum.time,
        time: 0
      },
      prim: {
        particles: quantum.primordium,
        theorems: Primordium.totalTheorems
      },
      qc: {
        active: qc.isActive,
        mods: qc.mods,
        shard: qc.shards,
        presets: []
      },
      en: {
        unl: player.unlocks.entropy
      }
    };

    save.options = {
      font: "Verdana",
      notation: "sc",
      massDis: player.options.massDisplay
    };

    save.quotes = convertBitsToArray(player.tutorialBits);
    save.name = "aquamarine";

    copyToClipboard(btoa(JSON.stringify(save)));
    GameUI.notify.info(i18n.t("export_save_to_clipboard"));
  }
};

export function convertBitsToArray(bits, startIndex = 0) {
  const arr = [];
  let b = bits;
  let idx = startIndex;
  while (b !== 0) {
    if ((b & 1) === 1) arr.push(idx);
    b >>= 1;
    idx++;
  }
  return arr;
}