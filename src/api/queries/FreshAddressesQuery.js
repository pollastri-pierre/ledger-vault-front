// @flow
import Query from "restlay/Query";
import schema from "data/schema";

type Input = {
  accountId: string,
};

type Response = *;

// Fetch a specific group
export default class FreshAddressesQuery extends Query<Input, Response> {
  // uri = `/accounts/${this.props.accountId}/fresh_addresses`;
  // NOTE: mock url, operator can't call this endpoint now
  uri = `/accounts/${this.props.accountId}/mocks/fresh_addresses`;

  responseSchema = [schema.FreshAddress];
}
