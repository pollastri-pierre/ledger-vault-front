// @flow

import React from "react";

import { TableCell } from "components/Table/TableBase";
import EntityStatus from "components/EntityStatus";

import type { Whitelist } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  whitelist: Whitelist,
  item: TableItem,
};
function WhitelistBodyCell(props: CellProps) {
  const { whitelist, item } = props;

  const renderCellMapper = () => {
    switch (item.body.prop) {
      case "name":
        return <div>{whitelist.name}</div>;
      case "addresses":
        return whitelist.addresses.length;
      case "status":
        return (
          <EntityStatus
            status={whitelist.status}
            request={whitelist.last_request}
          />
        );
      default:
        return <div>N/A</div>;
    }
  };

  return <TableCell align={item.body.align}>{renderCellMapper()}</TableCell>;
}

export default WhitelistBodyCell;
