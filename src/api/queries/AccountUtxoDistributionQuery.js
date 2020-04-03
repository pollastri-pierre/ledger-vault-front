// @flow

import Query from "restlay/Query";
import schema from "data/schema";
import type { UTXORange } from "data/types";
import { deserializeUtxo } from "api/transformations/Utxo";

type Input = {
  accountId: string,
};

type Response = UTXORange[];

const uri = props => {
  return `/accounts/${props.accountId}/utxos-distributions`;
};

export default class AccountUTXODistributionQuery extends Query<
  Input,
  Response,
> {
  uri = uri(this.props);

  deserialize = deserializeUtxo;

  responseSchema = [schema.UtxoRange];
}
