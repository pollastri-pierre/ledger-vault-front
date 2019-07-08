// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import EntityStatus from "components/EntityStatus";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  account: Account,
  item: TableItem,
};
class AccountBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { account, item } = this.props;
    switch (item.body.prop) {
      case "name":
        return <AccountName account={account} />;
      case "status":
        return (
          <EntityStatus
            status={account.status}
            request={account.last_request}
          />
        );
      case "countervalue":
        return <CounterValue fromAccount={account} value={account.balance} />;
      case "balance":
        return (
          <CurrencyAccountValue account={account} value={account.balance} />
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
