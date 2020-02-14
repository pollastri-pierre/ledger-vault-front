// @flow

import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { UTXO } from "data/types";

type Input = {
  accountId: string,
};

type Node = UTXO;

const uri = () => {
  return `/utxos-mocks`;
};

export default class AccountUnspentOutputsQuery extends ConnectionQuery<
  Input,
  Node,
> {
  uri = uri();

  nodeSchema = schema.Utxo;
}
