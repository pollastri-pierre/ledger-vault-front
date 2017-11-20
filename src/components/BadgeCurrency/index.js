//@flow
import React, { PureComponent } from "react";
import type { Currency } from "../../data/types";
import "./index.css";

class BadgeCurrency extends PureComponent<{
  size: number,
  currency: Currency
}> {
  static defaultProps = {
    size: 6
  };
  render() {
    const { size, currency } = this.props;
    return (
      <span
        className="badge-currency"
        style={{ width: size, height: size, background: currency.color }}
      />
    );
  }
}

export default BadgeCurrency;
