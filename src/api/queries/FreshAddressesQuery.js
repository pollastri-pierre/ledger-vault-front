// @flow
import Query from "restlay/Query";

type Input = {
  accountId: number,
};

type Response = *;

export default class FreshAddressesQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/fresh_addresses`;
}
