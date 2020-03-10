// @flow

import React from "react";

import type { UTXORange, Account } from "data/types";
import { TableRow } from "components/Table/TableBase";
import type { TableDefinition } from "../types";
import UtxoDistributionBodyCell from "./UtxoDistributionBodyCell";

type UtxoDistrubtionRowProps = {
  utxoRange: UTXORange,
  account: Account,
  onClick: UTXORange => void,
  tableDefinition: TableDefinition,
};

function UtxoDistributionRow(props: UtxoDistrubtionRowProps) {
  const { utxoRange, onClick, account, tableDefinition } = props;

  const handleClick = () => {
    onClick(utxoRange);
  };

  return (
    <TableRow key={utxoRange.range} onClick={onClick ? handleClick : undefined}>
      {tableDefinition.map(item => (
        <UtxoDistributionBodyCell
          account={account}
          utxoRange={utxoRange}
          item={item}
          key={item.body.prop}
        />
      ))}
    </TableRow>
  );
}

export default UtxoDistributionRow;
