//@flow
import React, { Component } from "react";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "../../data/currency";
import type { Account, Rate } from "../../data/types";
import "./index.css";

class Amount extends Component<*> {
  props: {
    account: Account,
    value: number,
    rate?: Rate,
    strong?: boolean
  };

  render() {
    const { account, value, rate, strong } = this.props;
    const counterValueUnit = countervalueForRate(
      rate || account.currencyRate,
      value
    );
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
