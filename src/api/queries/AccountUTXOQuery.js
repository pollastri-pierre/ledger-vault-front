// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { UTXO } from "data/types";
import { deserializeUtxo } from "api/transformations/Utxo";

type Input = {
  accountId: number,
  pageSize?: number,
  page?: number,
};

type Node = UTXO;

const uri = (query: Input) => {
  const endpoint = `/accounts/${query.accountId}/utxos`;
  const params = `?page=${query.page || 1}&pageSize=${query.pageSize || 30}`;
  return `${endpoint}${params}`;
};

export default class AccountUnspentOutputsQuery extends ConnectionQuery<
  Input,
  Node,
> {
  uri = uri(this.props);

  nodeSchema = schema.Utxo;

  pageSize = this.props.pageSize || 30;

  deserialize = deserializeUtxo;
}
