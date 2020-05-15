// @flow

import React from "react";

import type { Account } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import AccountBodyCell from "./AccountBodyCell";

type AccountRowProps = {
  account: Account,
  onClick: (Account) => void,
  tableDefinition: TableDefinition,
};

function AccountRow(props: AccountRowProps) {
  const { account, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(account);
  };

  return (
    <TableRow key={account.id} onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map((item) => (
        <AccountBodyCell account={account} item={item} key={item.body.prop} />
      ))}
    </TableRow>
  );
}

export default AccountRow;
