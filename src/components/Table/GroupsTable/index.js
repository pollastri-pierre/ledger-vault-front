// @flow

import React, { PureComponent } from "react";

import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";

import type { ObjectParameters } from "query-string";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Group } from "data/types";
import type { TableDefinition } from "../types";
import { TableHeader } from "../TableBase";
import GroupRow from "./GroupRow";
import { groupsTableDefault } from "./tableDefinitions";

import TableScroll from "../TableScroll";

type Props = {
  data: Group[],
  onRowClick: Group => void,
  customTableDef?: TableDefinition,
  queryParams?: ObjectParameters,
  onSortChange?: (string, ?string) => void,
};

type State = {
  tableDefinition: TableDefinition,
};

class GroupsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || groupsTableDefault,
    };
  }

  Group = (group: Group) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <GroupRow
        key={group.id}
        group={group}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;

    if (!data.length) {
      return <NoDataPlaceholder title="No groups found." />;
    }
    return (
      <TableScroll>
        <MUITable>
          <TableHeader
            tableDefinition={tableDefinition}
            type="groups"
            onSortChange={onSortChange}
            queryParams={queryParams}
          />
          <MUITableBody>{data.map(this.Group)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

export default GroupsTable;
