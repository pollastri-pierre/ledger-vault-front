// @flow

import React from "react";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import EntityStatus from "components/EntityStatus";
import ApproverRole from "components/ApproverRole";
import DateFormat from "components/DateFormat";
import { TableCell } from "components/Table/TableBase";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import NotApplicableText from "components/base/NotApplicableText";
import Box from "components/base/Box";

import type { Account } from "data/types";
import type { TableItem } from "../types";

import AccountDetailsButton from "./AccountDetailsButton";

type CellProps = {
  account: Account,
  item: TableItem,
};
function AccountBodyCell(props: CellProps) {
  const { account, item } = props;

  const renderCellMapper = () => {
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
      case "available_balance":
        return account.status === "PENDING" ? (
          <NotApplicableText />
        ) : (
          <Box>
            <CurrencyAccountValue
              account={account}
              value={account.available_balance}
            />
            <CounterValue
              fromAccount={account}
              value={account.available_balance}
            />
          </Box>
        );
      case "balance":
        return account.status === "PENDING" ? (
          <NotApplicableText />
        ) : (
          <Box>
            <CurrencyAccountValue account={account} value={account.balance} />
            <CounterValue fromAccount={account} value={account.balance} />
          </Box>
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

  return (
    <TableCell align={item.body.align} size={item.body.size}>
      {renderCellMapper()}
    </TableCell>
  );
}

export default AccountBodyCell;
