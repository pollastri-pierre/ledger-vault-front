// @flow

import React, { useState } from "react";

import type { ObjectParameters } from "query-string";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Group } from "data/types";
import type { TableDefinition } from "../types";
import { Table, TableHeader } from "../TableBase";
import GroupRow from "./GroupRow";
import { groupsTableDefault } from "./tableDefinitions";

import TableScroll from "../TableScroll";

type Props = {
  data: Group[],
  onRowClick: (Group) => void,
  customTableDef?: TableDefinition,
  queryParams?: ObjectParameters,
  onSortChange?: (string, ?string) => void,
};

function GroupsTable(props: Props) {
  const { data, onSortChange, queryParams, customTableDef, onRowClick } = props;
  const [tableDefinition] = useState(customTableDef || groupsTableDefault);
  const GroupComponent = (group: Group) => {
    return (
      <GroupRow
        key={group.id}
        group={group}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No groups found." />;
  }
  return (
    <TableScroll>
      <Table>
        <TableHeader
          tableDefinition={tableDefinition}
          type="groups"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <tbody>{data.map(GroupComponent)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default GroupsTable;
