//@flow
import React, { Component } from "react";
import ArrowDown from "../icons/ArrowDown";
import CurrencyNameValue from "../CurrencyNameValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "../../data/currency";
import "./index.css";

class OverviewOperation extends Component<*> {
  props: {
    amount: number,
    rate: *,
    hash: string,
    currency: string
  };

  render() {
    const { hash, amount, rate, currency } = this.props;
    const counterValueUnit = countervalueForRate(rate, amount);
    return (
      <div className="operation-overview-header">
        <div className="operation-overview-amount">
          <p className="crypto-amount">
            <CurrencyNameValue currencyName={currency} value={amount} />
          </p>
          <ArrowDown className="arrow-grey-down" />
          <p className="euro-amount">
            <CurrencyUnitValue {...counterValueUnit} />
          </p>
          <p className="hash">{hash}</p>
        </div>
      </div>
    );
  }
}

export default OverviewOperation;
