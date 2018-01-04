//@flow
import React, { Component } from "react";
import BadgeCurrency from "../BadgeCurrency";
import type { Currency } from "data/types";

// FIXME why is that not just taking Account ?
class AccountName extends Component<{
  name: string | React$Node,
  currency: Currency,
}> {
  render() {
    const { name, currency } = this.props;
    return (
      <span>
        <BadgeCurrency currency={currency} />
        <span>{name}</span>
      </span>
    );
  }
}

export default AccountName;
