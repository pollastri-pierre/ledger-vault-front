//@flow
import React, { Component } from "react";
import ArrowDown from "../icons/ArrowDown";
import CurrencyNameValue from "../CurrencyNameValue";
import "./index.css";

class OverviewOperation extends Component<*> {
  props: {
    amount: number,
    amount_flat: number,
    hash: string,
    currency: string
  };

  render() {
    const { hash, amount, amount_flat, currency } = this.props;
    return (
      <div className="operation-overview-header">
        <div className="operation-overview-amount">
          <p className="crypto-amount">
            <CurrencyNameValue currencyName={currency} value={amount} />
          </p>
          <ArrowDown className="arrow-grey-down" />
          <p className="euro-amount">
            <CurrencyNameValue currencyName="EUR" value={amount_flat} />
          </p>
          <p className="hash">{hash}</p>
        </div>
      </div>
    );
  }
}

export default OverviewOperation;
