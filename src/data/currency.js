//@flow
import fiatUnits from "constants/fiatUnits";
import type { Account, Unit } from "./types";

// This define utility to deal with currencies, units, countervalues

export function getAccountCurrencyUnit(account: Account): Unit {
  // const unitIndex: number = account.settings ? account.settings.unit_index : -1;
  return account.settings.currency_unit;
  // return account.currency.units[unitIndex] || account.currency.units[0];
}

export function getFiatUnit(fiat: string): Unit {
  const unit = fiatUnits[fiat];
  if (!unit) {
    throw new Error(`unit "${fiat}" not found`);
  }
  return unit;
}
