// @flow

import React from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Account } from "data/types";

import type { TableDefinition } from "../types";
import AccountBodyCell from "./AccountBodyCell";

type AccountRowProps = {
  account: Account,
  onClick: Account => void,
  tableDefinition: TableDefinition,
};

const accountRowHover = { cursor: "pointer" };

function AccountRow(props: AccountRowProps) {
  const { account, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(account);
  };

  return (
    <MUITableRow
      key={account.id}
      hover={!!onClick}
      style={onClick ? accountRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      {tableDefinition.map(item => (
        <AccountBodyCell account={account} item={item} key={item.body.prop} />
      ))}
    </MUITableRow>
  );
}

export default AccountRow;
