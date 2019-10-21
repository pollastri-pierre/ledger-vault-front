// @flow

import React, { PureComponent } from "react";

import MUITableRow from "@material-ui/core/TableRow";

import type { Whitelist } from "data/types";

import type { TableDefinition } from "../types";
import WhitelistBodyCell from "./WhitelistBodyCell";

type WhitelistRowProps = {
  whitelist: Whitelist,
  onClick: Whitelist => void,
  tableDefinition: TableDefinition,
};

const whitelistRowHover = { cursor: "pointer" };

class WhitelistRow extends PureComponent<WhitelistRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.whitelist);
  };

  render() {
    const { whitelist, onClick, tableDefinition } = this.props;

    return (
      <MUITableRow
        key={whitelist.id}
        hover={!!onClick}
        style={onClick ? whitelistRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        {tableDefinition.map(item => (
          <WhitelistBodyCell
            whitelist={whitelist}
            item={item}
            key={item.body.prop}
          />
        ))}
      </MUITableRow>
    );
  }
}

export default WhitelistRow;
