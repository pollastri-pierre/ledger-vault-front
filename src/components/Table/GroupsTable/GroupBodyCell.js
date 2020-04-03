// @flow

import React from "react";

import { TableCell } from "components/Table/TableBase";
import EntityStatus from "components/EntityStatus";
import type { Group } from "data/types";
import GroupMembersCell from "./GroupMembersCell";
import type { TableItem } from "../types";

type CellProps = {
  group: Group,
  item: TableItem,
};
function GroupBodyCell(props: CellProps) {
  const { group, item } = props;

  const renderCellMapper = () => {
    switch (item.body.prop) {
      case "name":
        return <div>{group.name}</div>;
      case "members":
        return <GroupMembersCell members={group.members || []} />;
      case "status":
        return (
          <EntityStatus status={group.status} request={group.last_request} />
        );
      default:
        return <div>N/A</div>;
    }
  };

  return <TableCell align={item.body.align}>{renderCellMapper()}</TableCell>;
}

export default GroupBodyCell;
