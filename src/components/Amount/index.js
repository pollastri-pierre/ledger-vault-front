//@flow
import React, { Component } from "react";
import CurrencyNameValue from "../CurrencyNameValue";
import CurrencyUnitValue from "../CurrencyUnitValue";
import { countervalueForRate } from "../../data/currency";
import "./index.css";

class Amount extends Component<*> {
  props: {
    currencyName: string,
    value: number,
    rate: *,
    strong?: boolean
  };

  render() {
    const { currencyName, value, rate, strong } = this.props;
    const counterValueUnit = countervalueForRate(rate, value);
    return (
      <span className={`${strong ? "amount-strong" : ""}`}>
        <CurrencyNameValue currencyName={currencyName} value={value} />{" "}
        <span className="flat-amount">
          <CurrencyUnitValue {...counterValueUnit} />
        </span>
      </span>
    );
  }
}

export default Amount;
