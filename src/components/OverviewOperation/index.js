//@flow
import React, { Component } from "react";
import ArrowDown from "../icons/ArrowDown";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "../../data/currency";
import type { Rate, Account } from "../../data/types";
import "./index.css";

class OverviewOperation extends Component<{
  amount: number,
  hash: string,
  account: Account,
  rate: Rate
}> {
  render() {
    const { hash, amount, rate, account } = this.props;
    const counterValueUnit = countervalueForRate(rate, amount);
    return (
      <div className="operation-overview-header">
        <div className="operation-overview-amount">
          <p className="crypto-amount">
            <CurrencyAccountValue account={account} value={amount} />
          </p>
          <ArrowDown className="arrow-grey-down" />
          <p className="fiat-amount">
            <CurrencyUnitValue {...counterValueUnit} />
          </p>
          <p className="hash">{hash}</p>
        </div>
      </div>
    );
  }
}

export default OverviewOperation;
