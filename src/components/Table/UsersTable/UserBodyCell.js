// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import EntityStatus from "components/EntityStatus";
import DateFormat from "components/DateFormat";
import UserRoleFormatter from "components/UserRoleFormatter";

import type { User } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  user: User,
  item: TableItem,
};
class UserBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { user, item } = this.props;
    switch (item.body.prop) {
      case "date":
        return <DateFormat format="ddd D MMM, h:mmA" date={user.created_on} />;
      case "username":
        return user.username;
      case "role":
        return <UserRoleFormatter userRole={user.role} />;
      case "userid":
        return (user.user_id && user.user_id.toUpperCase()) || "";
      case "status":
        return (
          <EntityStatus
            status={user.status}
            request={user.last_request && user.last_request}
          />
        );
      default:
        return <div>N/A</div>;
    }
  };

  render() {
    const { item } = this.props;
    return (
      <MUITableCell align={item.body.align}>
        {this.renderCellMapper()}
      </MUITableCell>
    );
  }
}

export default UserBodyCell;
