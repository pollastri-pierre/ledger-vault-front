//@flow
import React, { Component } from "react";
import BadgeCurrency from "../BadgeCurrency";
import type { Currency } from "../../data/types";
import "./index.css";

class AccountName extends Component<{
  name: string | React$Node,
  currency: Currency
}> {
  render() {
    const { name, currency } = this.props;
    return (
      <span className="account-name">
        <BadgeCurrency currency={currency} />
        <span className="name">{name}</span>
      </span>
    );
  }
}

export default AccountName;
