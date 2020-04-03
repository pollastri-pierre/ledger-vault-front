// @flow

import React, { useState } from "react";

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

function UsersTable(props: Props) {
  const { onRowClick, customTableDef, data, onSortChange, queryParams } = props;

  const [tableDefinition] = useState(customTableDef || usersTableDefault);

  const UserComponent = (user: User) => {
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
        <tbody>{data.map(UserComponent)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default UsersTable;
