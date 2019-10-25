// @flow

import React from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { User } from "data/types";

import type { TableDefinition } from "../types";
import UserBodyCell from "./UserBodyCell";

type UserRowProps = {
  user: User,
  onClick: User => void,
  tableDefinition: TableDefinition,
};

const userRowHover = { cursor: "pointer" };

function UserRow(props: UserRowProps) {
  const { user, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(user);
  };

  return (
    <MUITableRow
      key={user.id}
      hover={!!onClick}
      style={onClick ? userRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      {tableDefinition.map(item => (
        <UserBodyCell user={user} item={item} key={item.body.prop} />
      ))}
    </MUITableRow>
  );
}

export default UserRow;
