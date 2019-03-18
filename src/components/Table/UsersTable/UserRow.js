// @flow

import React, { PureComponent } from "react";

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

class UserRow extends PureComponent<UserRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.user);
  };

  render() {
    const { user, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={user.id}
        hover={!!onClick}
        style={onClick ? userRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <UserBodyCell user={user} item={item} key={item.body.prop} />
        ))}
      </MUITableRow>
    );
  }
}

export default UserRow;
