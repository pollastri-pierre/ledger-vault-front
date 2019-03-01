// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import Status from "components/Status";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  account: Account,
  item: TableItem
};
class AccountBodyCell extends PureComponent<CellProps, *> {
  renderCellMapper = () => {
    const { account, item } = this.props;
    switch (item.body.prop) {
      case "name":
        return <AccountName account={account} />;
      case "status":
        return <Status status={account.status} />;
      case "countervalue":
        return (
          <CounterValue
            from={account.currency_id}
            value={account.balance}
            alwaysShowSign
            disableCountervalue={account.account_type === "ERC20"}
          />
        );
      case "balance":
        return (
          <CurrencyAccountValue
            account={account}
            value={account.balance}
            erc20Format={account.account_type === "erc20"}
          />
        );
      case "date":
        return <DateFormat date={account.created_on} />;
      default:
        return <div>N/A</div>;
    }
  };

  render() {
    const { item } = this.props;
    return (
      <MUITableCell align={item.body.align}>
        {this.renderCellMapper()}
      </MUITableCell>
    );
  }
}

export default AccountBodyCell;
