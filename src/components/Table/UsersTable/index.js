// @flow

import React, { PureComponent } from "react";

import MUITableBody from "@material-ui/core/TableBody";

import type { ObjectParameters } from "query-string";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import type { User } from "data/types";
import { usersTableDefault } from "./tableDefinitions";
import UserRow from "./UserRow";
import { Table, TableHeader } from "../TableBase";

import type { TableDefinition } from "../types";

import TableScroll from "../TableScroll";

type Props = {
  data: User[],
  onRowClick: User => void,
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
};
type State = {
  tableDefinition: TableDefinition,
};

class UsersTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || usersTableDefault,
    };
  }

  User = (user: User) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;

    const key = `${user.id}`;

    return (
      <UserRow
        key={key}
        user={user}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;

    if (!data.length) {
      return <NoDataPlaceholder title="No users found." />;
    }

    return (
      <TableScroll>
        <Table>
          <TableHeader
            tableDefinition={tableDefinition}
            type="users"
            onSortChange={onSortChange}
            queryParams={queryParams}
          />
          <MUITableBody>{data.map(this.User)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

export default UsersTable;
