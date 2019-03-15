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
    switch (item.body.prop) {
      case "status":
        return <EntityStatus status={request.status} request={request} />;
      case "activity":
        return <RequestTitle type={request.type} />;
      case "date":
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
