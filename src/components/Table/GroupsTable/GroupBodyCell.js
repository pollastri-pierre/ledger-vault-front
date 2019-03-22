// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import EntityStatus from "components/EntityStatus";

import type { Group } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  group: Group,
  item: TableItem,
};
class GroupBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { group, item } = this.props;
    switch (item.body.prop) {
      case "name":
        return <div>{group.name}</div>;
      case "members":
        return <div>{group.members && group.members.length}</div>;
      case "status":
        return (
          <EntityStatus status={group.status} request={group.last_request} />
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

export default GroupBodyCell;
