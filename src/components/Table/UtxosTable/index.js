// @flow

import React, { useState } from "react";
import type { ObjectParameters } from "query-string";

import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { UTXO, Account } from "data/types";
import UtxoRow from "./UtxoRow";

import { Table, TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import { UtxosTableDefault } from "./tableDefinitions";
import type { TableDefinition } from "../types";

type Props = {
  data: UTXO[],
  account: Account,
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  onRowClick?: (UTXO) => void,
};

function UtxosTable(props: Props) {
  const { data, account, onSortChange, queryParams, onRowClick } = props;
  const [tableDefinition] = useState(props.customTableDef || UtxosTableDefault);

  const Utxo = (utxo: UTXO) => {
    return (
      <UtxoRow
        key={utxo.id}
        utxo={utxo}
        account={account}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No utxos found." />;
  }

  return (
    <TableScroll>
      <Table>
        <TableHeader
          tableDefinition={tableDefinition}
          type="utxos"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <tbody>{data.map(Utxo)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default UtxosTable;
