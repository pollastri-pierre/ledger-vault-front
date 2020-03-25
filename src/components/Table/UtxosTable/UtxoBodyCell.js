// @flow

import React from "react";

import CounterValue from "components/CounterValue";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { TableCell } from "components/Table/TableBase";

import Box from "components/base/Box";
import Copy from "components/base/Copy";
import type { UTXO, Account } from "data/types";
import type { TableItem } from "../types";

type CellProps = {
  utxo: UTXO,
  account: Account,
  item: TableItem,
};
function UtxoBodyCell(props: CellProps) {
  const { utxo, item, account } = props;

  const renderCellMapper = () => {
    switch (item.body.prop) {
      case "txhash":
        return (
          <Box width={200}>
            <Copy text={utxo.tx_hash} compact />
          </Box>
        );
      case "index":
        return utxo.output_index;
      case "confirmations":
        return utxo.confirmations;
      case "countervalue":
        return <CounterValue value={utxo.amount} fromAccount={account} />;
      case "utxo":
        return (
          <Box width={200}>
            <Copy text={utxo.address} compact />
          </Box>
        );
      case "height":
        return utxo.height;
      case "amount":
        return <CurrencyAccountValue account={account} value={utxo.amount} />;
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

export default UtxoBodyCell;
