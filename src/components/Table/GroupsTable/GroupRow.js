// @flow

import React from "react";

import type { Group } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import GroupBodyCell from "./GroupBodyCell";

type GroupRowProps = {
  group: Group,
  onClick: Group => void,
  tableDefinition: TableDefinition,
};

function GroupRow(props: GroupRowProps) {
  const { group, onClick, tableDefinition } = props;
  const handleClick = () => {
    onClick(group);
  };

  return (
    <TableRow key={group.id} onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <GroupBodyCell group={group} item={item} key={item.body.prop} />
      ))}
    </TableRow>
  );
}

export default GroupRow;
