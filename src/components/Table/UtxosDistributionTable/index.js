// @flow

import React, { useState } from "react";
import type { ObjectParameters } from "query-string";

import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { UTXORange, Account } from "data/types";
import UtxoDistributionRow from "./UtxoDistributionRow";

import { Table, TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import { UtxosDistributionTableDefault } from "./tableDefinitions";
import type { TableDefinition } from "../types";

type Props = {
  data: Array<UTXORange>,
  account: Account,
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  onRowClick?: UTXORange => void,
};

function UtxosDistributionTable(props: Props) {
  const { data, account, onSortChange, queryParams, onRowClick } = props;
  const [tableDefinition] = useState(
    props.customTableDef || UtxosDistributionTableDefault,
  );

  const UtxoRange = (utxoRange: UTXORange) => {
    return (
      <UtxoDistributionRow
        key={utxoRange.range}
        utxoRange={utxoRange}
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
          type="utxosDistribution"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <tbody>{data.map(UtxoRange)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default UtxosDistributionTable;
