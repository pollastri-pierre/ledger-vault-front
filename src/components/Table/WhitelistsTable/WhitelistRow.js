// @flow

import React from "react";

import type { Whitelist } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import WhitelistBodyCell from "./WhitelistBodyCell";

type WhitelistRowProps = {
  whitelist: Whitelist,
  onClick: Whitelist => void,
  tableDefinition: TableDefinition,
};

function WhitelistRow(props: WhitelistRowProps) {
  const { whitelist, onClick, tableDefinition } = props;

  const handleClick = () => {
    onClick(whitelist);
  };

  return (
    <TableRow onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <WhitelistBodyCell
          whitelist={whitelist}
          item={item}
          key={item.body.prop}
        />
      ))}
    </TableRow>
  );
}

export default WhitelistRow;
