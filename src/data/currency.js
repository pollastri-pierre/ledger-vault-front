//@flow
import counterUnitValues from "../countervalue-units";
import type { Currency, Unit } from "../datatypes";

type UnitValue = { value: number, unit: Unit };

export function inferUnitValue(
  currencies: Array<Currency>,
  currencyName: string,
  value: number = 0, // by default, value just would get ignored
  countervalue: boolean = false // calculate and return the countervalue of the currency
): UnitValue {
  let unit;
  // try to find a countervalues unit
  if (currencyName in counterUnitValues) {
    unit = counterUnitValues[currencyName];
  } else {
    // try to find a crypto currencies unit
    const currency = currencies.find(c => c.name === currencyName);
    if (currency) {
      if (countervalue) {
        // countervalue was required instead
        const { rate } = currency;
        if (!rate) {
          throw new Error(`currency "${currencyName}" have no rate`);
        }
        const counterUnitValue = counterUnitValues[rate.currency_name];
        if (!counterUnitValue) {
          throw new Error(
            `countervalue "${rate.currency_name}" for currency "${currencyName}" not found`
          );
        }
        value = Math.round(rate.value * value);
        unit = counterUnitValue;
      } else {
        // TODO: this will depend on user pref (if you select mBTC vs BTC , etc..)
        // we might have a redux store that store user prefered unit per currencyName
        unit = currency.units[0];
        if (!unit) {
          throw new Error(`currency "${currencyName}" have no units`);
        }
      }
    } else {
      throw new Error(`currency "${currencyName}" not found`);
    }
  }
  return { unit, value };
}
