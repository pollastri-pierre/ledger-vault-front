// @flow

import React from "react";

import MUITableCell from "@material-ui/core/TableCell";

import Text from "components/base/Text";
import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import DateFormat from "components/DateFormat";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import TransactionStatus from "components/TransactionStatus";

import type { Account, Transaction } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  account: Account,
  transaction: Transaction,
  item: TableItem,
};
function TransactionBodyCell(props: CellProps) {
  const { account, item, transaction } = props;

  const renderCellMapper = () => {
    const amount =
      transaction.amount || (transaction.price && transaction.price.amount);

    switch (item.body.prop) {
      case "type":
        return <TransactionTypeIcon type={transaction.type} />;
      case "created_on":
        return (
          <DateFormat format="ddd D MMM, h:mmA" date={transaction.created_on} />
        );

      case "name":
        return <AccountName account={account} />;
      case "status":
        return <TransactionStatus transaction={transaction} />;
      case "countervalue":
        return (
          <CounterValue
            fromAccount={account}
            value={amount}
            alwaysShowSign
            type={transaction.type}
          />
        );
      case "amount":
        return (
          <Text fontWeight={transaction.type === "RECEIVE" ? "bold" : null}>
            <CurrencyAccountValue
              account={account}
              value={amount}
              type={transaction.type}
              alwaysShowSign
            />
          </Text>
        );
      default:
        return <div>N/A</div>;
    }
  };

  return (
    <MUITableCell align={item.body.align} size={item.body.size}>
      {renderCellMapper()}
    </MUITableCell>
  );
}

export default TransactionBodyCell;
