// @flow
import Query from "restlay/Query";

type Input = {
  accountId: string,
};

type Response = *;

// Fetch a specific group
export default class FreshAddressesQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/fresh_addresses`;
  // uri = `/accounts/${this.props.accountId}/mocks/fresh_addresses`;
}
