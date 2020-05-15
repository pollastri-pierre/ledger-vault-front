// @flow

import React, { useState } from "react";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import type { BlockingReasonType } from "components/BlockingReasons";

import type { TableDefinition } from "../types";
import { Table, TableHeader } from "../TableBase";
import ReasonRow from "./ReasonRow";
import { reasonsTableDefault } from "./tableDefinitions";

import TableScroll from "../TableScroll";

type Props = {
  data: BlockingReasonType[],
  onRowClick: (BlockingReasonType) => void,
  customTableDef?: TableDefinition,
};

function ReasonsTable(props: Props) {
  const { data, onRowClick, customTableDef } = props;
  const [tableDefinition] = useState(customTableDef || reasonsTableDefault);
  const Reason = (reason: BlockingReasonType, i: number) => {
    return (
      <ReasonRow
        key={`${reason.type}_${i}_${reason.entity ? reason.entity.id : ""}`}
        reason={reason}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No reasons found." />;
  }
  return (
    <TableScroll>
      <Table>
        <TableHeader tableDefinition={tableDefinition} type="reasons" />
        <tbody>{data.map(Reason)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default ReasonsTable;
