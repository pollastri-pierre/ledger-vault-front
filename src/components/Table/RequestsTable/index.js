// @flow

import React, { PureComponent } from "react";
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

type State = {
  tableDefinition: TableDefinition,
};

class RequestsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || requestsTableDefault,
    };
  }

  Request = (request: GenericRequest) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <RequestRow
        key={request.id}
        request={request}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;
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
          <MUITableBody>{data.map(this.Request)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

export default RequestsTable;
