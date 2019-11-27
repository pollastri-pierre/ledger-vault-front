// @flow

import React from "react";

import MUITableCell from "@material-ui/core/TableCell";
import AccountName from "components/AccountName";
import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import type { BlockingReasonType } from "components/BlockingReasons";
import type { TableItem } from "../types";

type CellProps = {
  reason: BlockingReasonType,
  item: TableItem,
};
function ReasonBodyCell(props: CellProps) {
  const { reason, item } = props;
  const renderCellMapper = () => {
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
        return <div>{reason.type || <NotApplicableText />}</div>;
      case "reason":
        return <div>{reason.message}</div>;
      default:
        return <div>N/A</div>;
    }
  };

  return (
    <MUITableCell align={item.body.align}>{renderCellMapper()}</MUITableCell>
  );
}

export default ReasonBodyCell;
