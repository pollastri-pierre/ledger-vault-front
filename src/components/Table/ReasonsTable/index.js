// @flow

import React, { PureComponent } from "react";

import MUITableBody from "@material-ui/core/TableBody";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import type { BlockingReasonType } from "components/BlockingReasons";

import type { TableDefinition } from "../types";
import { Table, TableHeader } from "../TableBase";
import ReasonRow from "./ReasonRow";
import { reasonsTableDefault } from "./tableDefinitions";

import TableScroll from "../TableScroll";

type Props = {
  data: Array<BlockingReasonType>,
  onRowClick: BlockingReasonType => void,
  customTableDef?: TableDefinition,
};

type State = {
  tableDefinition: TableDefinition,
};

class ReasonsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || reasonsTableDefault,
    };
  }

  Reason = (reason: BlockingReasonType) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <ReasonRow
        key={`${reason.type}_${reason.entity.id}`}
        reason={reason}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data } = this.props;
    const { tableDefinition } = this.state;

    if (!data.length) {
      return <NoDataPlaceholder title="No reasons found." />;
    }
    return (
      <TableScroll>
        <Table>
          <TableHeader tableDefinition={tableDefinition} type="reasons" />
          <MUITableBody>{data.map(this.Reason)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

export default ReasonsTable;
