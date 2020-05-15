// @flow

import React from "react";

import type { UTXO, Account } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import UtxoBodyCell from "./UtxoBodyCell";

type UtxoRowProps = {
  utxo: UTXO,
  account: Account,
  onClick?: (UTXO) => void,
  tableDefinition: TableDefinition,
};

function UtxoRow(props: UtxoRowProps) {
  const { utxo, onClick, account, tableDefinition } = props;

  const handleClick = () => {
    if (!onClick) return;
    onClick(utxo);
  };

  return (
    <TableRow key={utxo.id} onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map((item) => (
        <UtxoBodyCell
          account={account}
          utxo={utxo}
          item={item}
          key={item.body.prop}
        />
      ))}
    </TableRow>
  );
}

export default UtxoRow;
