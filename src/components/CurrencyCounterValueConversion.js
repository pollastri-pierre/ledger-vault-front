//@flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { inferUnitValue } from "../data/currency";

class CurrencyCounterValueConversion extends PureComponent<*> {
  props: {
    currencyName: string,
    data: *
  };
  render() {
    const { currencyName, data } = this.props;
    const { unit } = inferUnitValue(data, currencyName);
    const value = Math.pow(10, unit.magnitude);
    const toUnitValue = inferUnitValue(data, currencyName, value, true);
    return (
      <span>
        <CurrencyUnitValue unit={unit} value={value} />
        {" ≈ "}
        <CurrencyUnitValue {...toUnitValue} />
      </span>
    );
  }
}

export default connect(({ data }) => ({ data }), () => ({}))(
  CurrencyCounterValueConversion
);
