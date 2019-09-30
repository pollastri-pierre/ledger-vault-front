// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import EntityStatus from "components/EntityStatus";
import ApproverRole from "components/ApproverRole";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";
import type { TableItem } from "../types";

import AccountDetailsButton from "./AccountDetailsButton";

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
        return account.status === "PENDING" ? (
          "N/A"
        ) : (
          <CounterValue fromAccount={account} value={account.balance} />
        );
      case "balance":
        return account.status === "PENDING" ? (
          "N/A"
        ) : (
          <CurrencyAccountValue account={account} value={account.balance} />
        );
      case "approver_role":
        return <ApproverRole account={account} />;
      case "date":
        return <DateFormat date={account.created_on} />;
      case "details":
        return <AccountDetailsButton account={account} />;
      default:
        return <div>N/A</div>;
    }
  };

  render() {
    const { item } = this.props;
    return (
      <MUITableCell align={item.body.align} size={item.body.size}>
        {this.renderCellMapper()}
      </MUITableCell>
    );
  }
}

export default AccountBodyCell;
