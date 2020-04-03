// @flow

import Query from "restlay/Query";
import schema from "data/schema";
import { deserializeAddress } from "api/transformations/Address";
import type { AddressDaemon } from "data/types";

type Input = {
  accountId: string,
  from: number,
  to: number,
};

type Response = AddressDaemon[];

export default class AddressFromDerivationPathQuery extends Query<
  Input,
  Response,
> {
  uri = `/accounts/${this.props.accountId}/addresses?from=${this.props.from}&to=${this.props.to}`;

  responseSchema = [schema.Addresses];

  deserialize = deserializeAddress;
}
