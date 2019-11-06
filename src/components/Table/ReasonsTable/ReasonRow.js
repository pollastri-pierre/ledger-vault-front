// @flow

import React from "react";
import MUITableRow from "@material-ui/core/TableRow";

import type { BlockingReasonType } from "components/BlockingReasons";

import type { TableDefinition } from "../types";
import ReasonBodyCell from "./ReasonBodyCell";

type ReasonRowProps = {
  reason: BlockingReasonType,
  onClick: BlockingReasonType => void,
  tableDefinition: TableDefinition,
};

const reasonRowHover = { cursor: "pointer" };

function ReasonRow(props: ReasonRowProps) {
  const { reason, onClick, tableDefinition } = props;
  const handleClick = () => {
    onClick(reason);
  };
  return (
    <MUITableRow
      hover={!!onClick}
      style={onClick ? reasonRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
    >
      {tableDefinition.map(item => (
        <ReasonBodyCell reason={reason} item={item} key={item.body.prop} />
      ))}
    </MUITableRow>
  );
}

export default ReasonRow;
