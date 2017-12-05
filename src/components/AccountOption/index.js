//@flow
import React, { Component } from "react";
import AccountName from "../AccountName";
import { Option } from "../Select";
import "./index.css";
import type { Account } from "../../data/types";

class AccountOption extends Component<{
  account: Account,
  value: *,
  selected: *
}> {
  render() {
    const { account, ...rest } = this.props;
    return (
      <Option {...rest}>
        <div className="account-option">
          <span className="account-name-container">
            <AccountName currency={account.currency} name={account.name} />
          </span>
          <span className="account-unit">
            {account.currency.units[account.settings.unitIndex].code}
          </span>
        </div>
      </Option>
    );
  }
}

export default AccountOption;
