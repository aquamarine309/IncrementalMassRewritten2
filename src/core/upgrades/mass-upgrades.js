import { RebuyableMechanicState } from "@/core/game-mechanics";
import { DC } from "@/core/constants";
import Decimal from "break_eternity.js";


class MassUpgradeState extends RebuyableMechanicState {
  _costLazy = new Lazy(() => this.config.cost(this.boughtAmount))
    .invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

  _effectValueLazy = new Lazy(() => this.config.effect(this))
    .invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

  get cost() {
    return this._costLazy.value;
  }

  get effectValue() {
    return this._effectValueLazy.value;
  }

  get boughtAmount() {
    return player.massUpgrades[this.id];
  }

  set boughtAmount(value) {
    player.massUpgrades[this.id] = value;
    this._costLazy.invalidate();
    this._effectValueLazy.invalidate();
    this._nameLazy.invalidate();
  }

  _nameLazy = new Lazy(() => {
    const name = i18n.t(this.config.i18nKey ?? this.id);
    const scaling = this.config.scaling;
    if (scaling === undefined) return name;
    const scaleName = scaling.getName(this.boughtAmount);
    return `${scaleName}${name}`;
  }).invalidateOn(GAME_EVENT.GAME_TICK_AFTER);

  get name() {
    return this._nameLazy.value;
  }


  get freeAmount() {
    return this.config.freeAmount ?? DC.D0;
  }

  get totalAmount() {
    return this.boughtAmount.add(this.freeAmount);
  }

  get currency() {
    return this.config.currency;
  }

  get power() {
    return this.config.power;
  }

  get isCustomEffect() {
    return true;
  }

  get isUnlocked() {
    return this.config.isUnlocked;
  }

  get isDisabled() {
    return this.config.disabled ?? false;
  }

  get isEffectActive() {
    return this.isUnlocked;
  }

  get isAvailableForPurchase() {
    return this.isUnlocked && !this.isDisabled;
  }

  reset() {
    this.boughtAmount = DC.D0;
  }

  buyMax() {
    if (!this.canBeBought) return;
    const bulk = this.config.bulk(this.currency.value);
    if (bulk.lte(this.amount)) return;
    if (this.isFree) {
      this.boughtAmount = bulk;
      this.onPurchased();
      return;
    }
    this.boughtAmount = bulk.minus(1);
    this.purchase();
  }

  get softcapLevel() {
    const level = this.config.softcapLevel;
    if (level) return level(this.effectValue);
    return 0;
  }

  get autoUnlocked() {
    return this.config.autoUnlocked ?? false;
  }

  get auto() {
    return Autobuyer.massUpgrade(MassUpgrade.indexOf(this.id) + 1);
  }

  get forceVisible() {
    return this.config.forceVisible ?? false;
  }

  get isFree() {
    return this.config.isFree ?? false;
  }

  onPurchased() {
    return this.config.onPurchased?.();
  }
}

export const MassUpgrade = mapGameDataToObject(
  GameDatabase.upgrades.mass,
  config => new MassUpgradeState(config)
);

MassUpgrade.indexOf = (function() {
  const cache = Object.values(MassUpgrade.all).reduce(
    (map, key, index) => map.set(key.id, index),
    new Map());
  return id => cache.get(id);
}());

export const MassUpgradeSoftcap = {
  stronger: [
    {
      level: 1,
      get start() {
        let start = DC.E1;
        start = start.plusEffectsOf(
          RankType.rank.unlocks.mu3softcap,
          BHUpgrade(8)
        );
        return start;
      },
      get scale() {
        return DC.D0_5.timesEffectsOf(
          AtomUpgrade(8),
          RankType.tier.unlocks.strongerCapWeak
        );
      }
    },
    {
      level: 2,
      get start() {
        return DC.D1_8E5;
      },
      get scale() {
        return DC.D0_5;
      }
    },
    {
      level: 3,
      get start() {
        if (RankType.pent.unlocks.removeStrongerSoftcap.canBeApplied) return Decimal.dInf;
        let start = DC.D5E15;
        if (GameElement(85).canBeApplied) {
          start = start.times(3);
        }
        return start;
      },
      get scale() {
        let scale = DC.D0_1;
        if (GameElement(85).canBeApplied) {
          scale = scale.pow(DC.D0_9);
        }
        return scale;
      }
    },
  ],
  softcapLevel(effect, softcaps) {
    let level = 0;
    for (const softcap of softcaps) {
      if (effect.lt(softcap.start)) {
        return level;
      }
      level = softcap.level;
    }
    return level;
  }
};