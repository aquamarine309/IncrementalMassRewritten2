import { BitPurchasableMechanicState } from "../game-mechanics";

export class MainUpgradeState extends BitPurchasableMechanicState {
  /** @absolute */
  get key() {
    throw new NotImplementedError();
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.mainUpgrades[this.key];
  }

  set bits(value) {
    player.mainUpgrades[this.key] = value;
  }

  get url() {
    return `./images/upgrades/${this.key.replace(/\B([A-Z])/gu, "-$1").toLowerCase()}/${this.id}.png`;
  }

  get noReset() {
    return false;
  }

  reset() {
    this.isBought = false;
  }

  get isUnlocked() {
    return this.config.isUnlocked?.() ?? true;
  }
}