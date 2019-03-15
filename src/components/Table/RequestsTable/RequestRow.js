// @flow

import React, { PureComponent } from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Request } from "data/types";

import type { TableDefinition } from "../types";
import RequestBodyCell from "./RequestBodyCell";

type RequestRowProps = {
  request: Request,
  onClick: Request => void,
  tableDefinition: TableDefinition,
};

const requestRowHover = { cursor: "pointer" };

class RequestRow extends PureComponent<RequestRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.request);
  };

  render() {
    const { request, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={request.id}
        hover={!!onClick}
        style={onClick ? requestRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <RequestBodyCell request={request} item={item} key={item.body.prop} />
        ))}
      </MUITableRow>
    );
  }
}

export default RequestRow;
