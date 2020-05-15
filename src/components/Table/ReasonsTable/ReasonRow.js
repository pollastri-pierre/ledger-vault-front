// @flow

import React from "react";

import type { BlockingReasonType } from "components/BlockingReasons";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import ReasonBodyCell from "./ReasonBodyCell";

type ReasonRowProps = {
  reason: BlockingReasonType,
  onClick: (BlockingReasonType) => void,
  tableDefinition: TableDefinition,
};

function ReasonRow(props: ReasonRowProps) {
  const { reason, onClick, tableDefinition } = props;
  const handleClick = () => {
    onClick(reason);
  };
  return (
    <TableRow onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map((item) => (
        <ReasonBodyCell reason={reason} item={item} key={item.body.prop} />
      ))}
    </TableRow>
  );
}

export default ReasonRow;
