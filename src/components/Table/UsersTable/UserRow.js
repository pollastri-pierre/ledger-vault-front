// @flow

import React from "react";

import type { User } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import UserBodyCell from "./UserBodyCell";

type UserRowProps = {
  user: User,
  onClick: User => void,
  tableDefinition: TableDefinition,
};

function UserRow(props: UserRowProps) {
  const { user, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(user);
  };

  return (
    <TableRow onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <UserBodyCell user={user} item={item} key={item.body.prop} />
      ))}
    </TableRow>
  );
}

export default UserRow;
