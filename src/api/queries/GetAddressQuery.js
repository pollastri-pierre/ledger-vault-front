// @flow
import Query from "restlay/Query";

type Input = {
  accountId: string,
  derivation_path: string,
};

type Response = *;

export default class GetAddressQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/address?derivation_path=${
    this.props.derivation_path
  }`;
}
