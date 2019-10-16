// @flow

import React, { PureComponent } from "react";

import MUITableBody from "@material-ui/core/TableBody";

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
  onRowClick: Whitelist => void,
  customTableDef?: TableDefinition,
  queryParams?: ObjectParameters,
  onSortChange?: (string, ?string) => void,
};

type State = {
  tableDefinition: TableDefinition,
};

class WhitelistsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || whitelistsTableDefault,
    };
  }

  Whitelist = (whitelist: Whitelist) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <WhitelistRow
        key={whitelist.id}
        whitelist={whitelist}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;

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
          <MUITableBody>{data.map(this.Whitelist)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

export default WhitelistsTable;
