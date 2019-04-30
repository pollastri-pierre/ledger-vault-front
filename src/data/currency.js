// @flow

import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import fiatUnits from "constants/fiatUnits";
import type { Account, Unit } from "./types";

// This define utility to deal with currencies, units, countervalues

export function getAccountCurrencyUnit(account: Account): Unit {
  if (!account.settings || !account.settings.currency_unit) {
    console.warn("account doesnt have settings. using default unit");
    const currency = getCryptoCurrencyById(account.currency);
    // $FlowFixMe this is compatible with Unit anyway
    return currency.units[0];
  }
  return account.settings.currency_unit;
}

export function getFiatUnit(fiat: string): Unit {
  const unit = fiatUnits[fiat];
  if (!unit) {
    throw new Error(`unit "${fiat}" not found`);
  }
  return unit;
}
