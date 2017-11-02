//@flow
import { connect } from "react-redux";
import React, { PureComponent } from "react";
import CurrencyUnitValue from "./CurrencyUnitValue";
import { inferUnitValue } from "../data/currency";

type Props = {
  // it can be a crypto currency name or also can be a countervalue like EUR
  currencyName: string,
  // it is the value to display without any digits (for BTC it is satoshi, for EUR it is the nb of cents)
  value: number,
  // always show a sign in front of the value (force a "+" to display for positives)
  alwaysShowSign?: boolean,
  // if true, display the countervalue instead of the actual crypto currency
  countervalue: boolean,
  // data store
  data: *
};

// This is a "smart" component that accepts a currencyName (e.g. bitcoin) and a value number
// and infer the proper "unit" to use and delegate to CurrencyUnitValue

class CurrencyNameValue extends PureComponent<Props> {
  static defaultProps = {
    countervalue: false
  };
  render() {
    const { currencyName, countervalue, value, data, ...rest } = this.props;
    const UnitValue = inferUnitValue(data, currencyName, value, countervalue);
    return <CurrencyUnitValue {...rest} {...UnitValue} />;
  }
}

export default connect(({ data }) => ({ data }), () => ({}))(CurrencyNameValue);
