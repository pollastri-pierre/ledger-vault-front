// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";

import EntityStatus from "components/EntityStatus";

import type { Whitelist } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  whitelist: Whitelist,
  item: TableItem,
};
class WhitelistBodyCell extends PureComponent<CellProps> {
  renderCellMapper = () => {
    const { whitelist, item } = this.props;
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

  render() {
    const { item } = this.props;
    return (
      <MUITableCell align={item.body.align}>
        {this.renderCellMapper()}
      </MUITableCell>
    );
  }
}

export default WhitelistBodyCell;
