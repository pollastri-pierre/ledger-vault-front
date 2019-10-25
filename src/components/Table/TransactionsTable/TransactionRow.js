// @flow

import React from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Account, Transaction } from "data/types";

import type { TableDefinition } from "../types";
import TransactionBodyCell from "./TransactionBodyCell";

type TransactionRowProps = {
  transaction: Transaction,
  account: Account,
  onClick: Transaction => void,
  tableDefinition: TableDefinition,
};

const transactionRowHover = { cursor: "pointer" };

function TransactionRow(props: TransactionRowProps) {
  const { transaction, account, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(transaction);
  };

  return (
    <MUITableRow
      key={transaction.id}
      hover={!!onClick}
      style={onClick ? transactionRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      {tableDefinition.map(item => (
        <TransactionBodyCell
          account={account}
          transaction={transaction}
          item={item}
          key={item.body.prop}
        />
      ))}
    </MUITableRow>
  );
}

export default TransactionRow;
