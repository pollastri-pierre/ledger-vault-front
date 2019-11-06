// @flow

import React from "react";

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

function GroupRow(props: GroupRowProps) {
  const { group, onClick, tableDefinition } = props;
  const handleClick = () => {
    onClick(group);
  };

  return (
    <MUITableRow
      key={group.id}
      hover={!!onClick}
      style={onClick ? groupRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      {tableDefinition.map(item => (
        <GroupBodyCell group={group} item={item} key={item.body.prop} />
      ))}
    </MUITableRow>
  );
}

export default GroupRow;
