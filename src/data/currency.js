//@flow
import fiatUnits from "../fiat-units";
import type { Currency, Unit, Rate } from "../datatypes";

// This define utility to deal with currencies, units, countervalues

type UnitValue = { value: number, unit: Unit };

export function getCurrency(
  currencies: Array<Currency>,
  currencyName: string
): Currency {
  const currency = currencies.find(c => c.name === currencyName);
  if (!currency) {
    throw new Error(`currency "${currencyName}" not found`);
  }
  return currency;
}

export function getCurrencyRate(
  currencies: Array<Currency>,
  currencyName: string
): Rate {
  const { rate } = getCurrency(currencies, currencyName);
  if (!rate) {
    throw new Error(`currency "${currencyName}" have no rate`);
  }
  return rate;
}

// calculate the counter value at a specific rate
export function countervalueForRate(rate: Rate, value: number): UnitValue {
  const unit = fiatUnits[rate.currency_name];
  if (!unit) {
    throw new Error(`countervalue "${rate.currency_name}" not found`);
  }
  return {
    value: Math.round(rate.value * value),
    unit
  };
}

// Infer the currency unit. works with fiat too.
export function inferUnit(
  currencies: Array<Currency>,
  currencyName: string
): Unit {
  // try to find a countervalues unit
  if (currencyName in fiatUnits) {
    return fiatUnits[currencyName];
  } else {
    // try to find a crypto currencies unit
    const currency = getCurrency(currencies, currencyName);
    if (currency) {
      // TODO: this will depend on user pref (if you select mBTC vs BTC , etc..)
      // we might have a redux store that store user prefered unit per currencyName
      const unit = currency.units[0];
      if (!unit) {
        throw new Error(`currency "${currencyName}" have no units`);
      }
      return unit;
    } else {
      throw new Error(`currency "${currencyName}" not found`);
    }
  }
}
