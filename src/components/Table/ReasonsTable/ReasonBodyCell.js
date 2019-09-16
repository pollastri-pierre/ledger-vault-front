// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import type { BlockingReasonType } from "components/BlockingReasons";
import type { TableItem } from "../types";

type CellProps = {
  reason: BlockingReasonType,
  item: TableItem,
};
class ReasonBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { reason, item } = this.props;
    switch (item.body.prop) {
      case "entity":
        if (reason.type === "Account") {
          // $FlowFixMe: flow doesnt know reason.entity type is account
          return <AccountName account={reason.entity} />;
        }
        if (reason.type === "Transaction") {
          return (
            <Box horizontal>
              <TransactionTypeIcon type="SEND" />
              Transaction
            </Box>
          );
        }
        return <div>{reason.type || "N/A"}</div>;
      case "reason":
        return <div>{reason.message}</div>;
      default:
        return <div>N/A</div>;
    }
  };

  render() {
    const { item } = this.props;
    return (
      <MUITableCell align={item.body.align}>
        {this.renderCellMapper()}
      </MUITableCell>
    );
  }
}

export default ReasonBodyCell;
