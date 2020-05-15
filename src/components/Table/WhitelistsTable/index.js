// @flow

import React, { useState } from "react";

import type { ObjectParameters } from "query-string";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Whitelist } from "data/types";
import type { TableDefinition } from "../types";
import { Table, TableHeader } from "../TableBase";
import WhitelistRow from "./WhitelistRow";
import { whitelistsTableDefault } from "./tableDefinitions";

import TableScroll from "../TableScroll";

type Props = {
  data: Whitelist[],
  onRowClick: (Whitelist) => void,
  customTableDef?: TableDefinition,
  queryParams?: ObjectParameters,
  onSortChange?: (string, ?string) => void,
};

function WhitelistsTable(props: Props) {
  const { onRowClick, customTableDef, data, onSortChange, queryParams } = props;
  const [tableDefinition] = useState(customTableDef || whitelistsTableDefault);

  const WhitelistComponent = (whitelist: Whitelist) => {
    return (
      <WhitelistRow
        key={whitelist.id}
        whitelist={whitelist}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No whitelists found." />;
  }
  return (
    <TableScroll>
      <Table>
        <TableHeader
          tableDefinition={tableDefinition}
          type="whitelists"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <tbody>{data.map(WhitelistComponent)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default WhitelistsTable;
