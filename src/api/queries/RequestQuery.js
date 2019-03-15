// @flow
import Query from "restlay/Query";

type Input = {
  requestID: string,
};
export type Response = *;

export default class PendingRequestsQuery extends Query<Input, Response> {
  uri = `/requests/${this.props.requestID}`;
}
