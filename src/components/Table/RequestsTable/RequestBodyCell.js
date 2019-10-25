// @flow

import React from "react";
import MUITableCell from "@material-ui/core/TableCell";

import EntityStatus from "components/EntityStatus";
import { TransactionCreationRequestTitle } from "components/lists/RequestsList";
import DateFormat from "components/DateFormat";
import type { GenericRequest } from "data/types";
import RequestTitle from "components/RequestTitle";
import type { TableItem } from "../types";

type CellProps = {
  request: GenericRequest,
  item: TableItem,
};
function RequestBodyCell(props: CellProps) {
  const { request, item } = props;
  const renderCellMapper = () => {
    // FIXME
    // NOT SCALABLE. we should put directly React$Component
    // in table definition compared to add another level of
    // mapping wich add more confusion ¯\_(ツ)_/¯

    switch (item.body.prop) {
      case "status":
        return (
          <EntityStatus
            status={request.status}
            request={request}
            useRequestStatus
          />
        );
      case "type":
        return request.type === "CREATE_TRANSACTION" ? (
          <TransactionCreationRequestTitle request={request} />
        ) : (
          <RequestTitle request={request} />
        );
      case "created_on":
        return <DateFormat date={request.created_on} />;
      default:
        return <div>N/A</div>;
    }
  };

  return (
    <MUITableCell align={item.body.align}>{renderCellMapper()}</MUITableCell>
  );
}

export default RequestBodyCell;
