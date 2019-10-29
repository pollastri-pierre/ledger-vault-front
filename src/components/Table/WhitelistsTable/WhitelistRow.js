// @flow

import React from "react";

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

function WhitelistRow(props: WhitelistRowProps) {
  const { whitelist, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(whitelist);
  };

  return (
    <MUITableRow
      key={whitelist.id}
      hover={!!onClick}
      style={onClick ? whitelistRowHover : undefined}
      onClick={onClick ? handleClick : undefined}
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

export default WhitelistRow;
