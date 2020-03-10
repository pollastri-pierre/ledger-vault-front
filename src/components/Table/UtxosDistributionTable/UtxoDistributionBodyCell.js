// @flow

import React from "react";

import CounterValue from "components/CounterValue";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { TableCell } from "components/Table/TableBase";

import type { UTXORange, Account } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  utxoRange: UTXORange,
  account: Account,
  item: TableItem,
};
function UtxoDistributionBodyCell(props: CellProps) {
  const { utxoRange, item, account } = props;

  const renderCellMapper = () => {
    switch (item.body.prop) {
      case "utxo-range":
        return utxoRange.range;
      case "number":
        return utxoRange.number;
      case "countervalue":
        return <CounterValue value={utxoRange.amount} fromAccount={account} />;
      case "amount":
        return (
          <CurrencyAccountValue account={account} value={utxoRange.amount} />
        );
      default:
        return <div>N/A</div>;
    }
  };

  return (
    <TableCell align={item.body.align} size={item.body.size}>
      {renderCellMapper()}
    </TableCell>
  );
}

export default UtxoDistributionBodyCell;
