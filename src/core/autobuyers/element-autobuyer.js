import { AutobuyerState } from "./autobuyer";

export class ElementAutobuyerState extends AutobuyerState {
  get _elements() {
    return GameElements.all;
  }

  get isActive() {
    return player.auto.elements;
  }

  set isActive(value) {
    player.auto.elements = value;
  }

  get canTick() {
    return this._elements !== undefined && super.canTick;
  }

  get isUnlocked() {
    return NeutronUpgrade.qol1.isBought;
  }

  tick() {
    if (player.elements.size >= GameElements.maxId) return;
    for (let i = 1; i <= GameElements.maxId; i++) this._elements[i - 1].purchase();
  }
}
