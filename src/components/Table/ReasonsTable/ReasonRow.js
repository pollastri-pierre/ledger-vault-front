// @flow

import React, { PureComponent } from "react";
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

class ReasonRow extends PureComponent<ReasonRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.reason);
  };

  render() {
    const { reason, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={`${reason.type}_${reason.entity.id}`}
        hover={!!onClick}
        style={onClick ? reasonRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <ReasonBodyCell reason={reason} item={item} key={item.body.prop} />
        ))}
      </MUITableRow>
    );
  }
}

export default ReasonRow;
