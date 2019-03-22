// @flow

import React, { PureComponent } from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Group } from "data/types";

import type { TableDefinition } from "../types";
import GroupBodyCell from "./GroupBodyCell";

type GroupRowProps = {
  group: Group,
  onClick: Group => void,
  tableDefinition: TableDefinition,
};

const groupRowHover = { cursor: "pointer" };

class GroupRow extends PureComponent<GroupRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.group);
  };

  render() {
    const { group, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={group.id}
        hover={!!onClick}
        style={onClick ? groupRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <GroupBodyCell group={group} item={item} key={item.body.prop} />
        ))}
      </MUITableRow>
    );
  }
}

export default GroupRow;
