//@flow
import React, { PureComponent } from "react";
import connectData from "../decorators/connectData";
import api from "../data/api-spec";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { inferUnitValue } from "../data/currency";

class CurrencyCounterValueConversion extends PureComponent<*> {
  props: {
    currencyName: string,
    currencies: *
  };
  render() {
    const { currencyName, currencies } = this.props;
    const { unit } = inferUnitValue(currencies, currencyName);
    const value = Math.pow(10, unit.magnitude);
    const toUnitValue = inferUnitValue(currencies, currencyName, value, true);
    return (
      <span>
        <CurrencyUnitValue unit={unit} value={value} />
        {" ≈ "}
        <CurrencyUnitValue {...toUnitValue} />
      </span>
    );
  }
}

export default connectData(CurrencyCounterValueConversion, {
  api: {
    currencies: api.currencies
  }
});
