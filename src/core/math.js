import { DC } from "./constants";

export function getLinearCost(amount, baseCost, costMult) {
  return baseCost.times(costMult.pow(amount));
}

export function getLinearBulk(currency, baseCost, costMult) {
  return currency.div(baseCost).clampMin(1).log(costMult);
}

export function mlt(x) {
  return DC.D1_5E1000000056.pow(x);
}

export function uni(x) {
  return DC.D1_5E56.times(x);
}