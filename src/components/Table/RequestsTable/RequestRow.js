// @flow

import React from "react";

import { TableRow } from "components/Table/TableBase";
import type { GenericRequest } from "data/types";
import type { TableDefinition } from "../types";
import RequestBodyCell from "./RequestBodyCell";

type RequestRowProps = {
  request: GenericRequest,
  onClick: GenericRequest => void,
  tableDefinition: TableDefinition,
};

function RequestRow(props: RequestRowProps) {
  const { request, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(request);
  };

  return (
    <TableRow key={request.id} onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <RequestBodyCell request={request} item={item} key={item.body.prop} />
      ))}
    </TableRow>
  );
}

export default RequestRow;
