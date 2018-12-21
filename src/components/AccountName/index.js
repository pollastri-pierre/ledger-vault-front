//@flow
import React, { Component } from "react";
import BadgeCurrency from "../BadgeCurrency";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";

// FIXME why is that not just taking Account ?
class AccountName extends Component<{
  name: string | React$Node,
  currencyId: string
}> {
  render() {
    const { name, currencyId } = this.props;
    const curr = getCryptoCurrencyById(currencyId) || { color: "black" };
    return (
      <span>
        <BadgeCurrency currency={curr} />
        <span data-test="name">{name}</span>
      </span>
    );
  }
}

export default AccountName;
