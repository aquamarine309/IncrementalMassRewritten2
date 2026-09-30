import { GameMechanicState } from "./game-mechanic";
import Decimal from "break_eternity.js";

/**
 * @abstract
 */
export class RebuyableMechanicState extends GameMechanicState {
  /**
   * @abstract
   */
  get currency() { throw new NotImplementedError(); }

  get isAffordable() {
    return this.currency.gte(this.cost);
  }

  get cost() {
    return this.config.cost();
  }

  get isAvailableForPurchase() {
    return true;
  }

  get isCapped() {
    return false;
  }

  get isRebuyable() {
    return true;
  }

  get isFree() {
    return false;
  }

  /**
   * @abstract
   */
  get boughtAmount() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  set boughtAmount(value) { throw new NotImplementedError(); }

  get isEffectActive() {
    return this.boughtAmount.gt(0);
  }

  get canBeBought() {
    return this.isAffordable && this.isAvailableForPurchase && !this.isCapped;
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (!this.isFree) {
      this.currency.subtract(this.cost);
    }
    this.boughtAmount = this.boughtAmount.add(1);
    this.onPurchased();
    GameUI.update();
    return true;
  }

  reset() {
    this.boughtAmount = new Decimal(0);
  }

  // eslint-disable-next-line no-empty-function
  onPurchased() { }
}
