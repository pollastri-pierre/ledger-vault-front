// @flow

import React, { useState } from "react";
import MUITableBody from "@material-ui/core/TableBody";
import type { ObjectParameters } from "query-string";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import type { GenericRequest } from "data/types";
import RequestRow from "./RequestRow";

import { Table, TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import { requestsTableDefault } from "./tableDefinitions";
import type { TableDefinition } from "../types";

type Props = {
  data: GenericRequest[],
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  onRowClick: GenericRequest => void,
};

function RequestsTable(props: Props) {
  const { data, onSortChange, queryParams, customTableDef, onRowClick } = props;
  const [tableDefinition] = useState(customTableDef || requestsTableDefault);
  const Request = (request: GenericRequest) => {
    return (
      <RequestRow
        key={request.id}
        request={request}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No requests found." happy />;
  }

  return (
    <TableScroll>
      <Table>
        <TableHeader
          tableDefinition={tableDefinition}
          type="requests"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <MUITableBody>{data.map(Request)}</MUITableBody>
      </Table>
    </TableScroll>
  );
}

export default RequestsTable;
