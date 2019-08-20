// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import EntityStatus from "components/EntityStatus";
import DateFormat from "components/DateFormat";
import type { Request } from "data/types";
import RequestTitle from "components/RequestTitle";
import type { TableItem } from "../types";

type CellProps = {
  request: Request,
  item: TableItem,
};
class RequestBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { request, item } = this.props;

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
        return <RequestTitle request={request} />;
      case "created_on":
        return <DateFormat date={request.created_on} />;
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

export default RequestBodyCell;
