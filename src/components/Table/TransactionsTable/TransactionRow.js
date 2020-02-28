// @flow

import React from "react";

import type { Account, Transaction } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import TransactionBodyCell from "./TransactionBodyCell";

type TransactionRowProps = {
  transaction: Transaction,
  account: Account,
  onClick: Transaction => void,
  tableDefinition: TableDefinition,
};

function TransactionRow(props: TransactionRowProps) {
  const { transaction, account, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(transaction);
  };

  return (
    <TableRow onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <TransactionBodyCell
          account={account}
          transaction={transaction}
          item={item}
          key={item.body.prop}
        />
      ))}
    </TableRow>
  );
}

export default TransactionRow;
