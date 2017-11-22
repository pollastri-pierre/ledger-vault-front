//@flow
import React, { Component } from "react";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "../../data/currency";
import type { Account, Rate } from "../../data/types";
import "./index.css";

class Amount extends Component<{
  account: Account,
  value: number,
  rate?: Rate,
  strong?: boolean
}> {
  render() {
    const { account, value, rate, strong } = this.props;
    let finalRate = rate;
    if (!rate) {
      finalRate = account.currencyRate;
    }
    let counterValueUnit;
    if (finalRate) {
      counterValueUnit = countervalueForRate(finalRate, value);
    }
    return (
      <span className={`${strong ? "amount-strong" : ""}`}>
        <CurrencyAccountValue account={account} value={value} />{" "}
        <span className="flat-amount">
          <CurrencyUnitValue {...counterValueUnit} />
        </span>
      </span>
    );
  }
}

export default Amount;
