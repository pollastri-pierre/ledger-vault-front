// @flow
import Query from "restlay/Query";

type Input = void;
export type Response = *;

export default class PendingRequestsQuery extends Query<Input, Response> {
  uri = "/requests?status=PENDING_APPROVAL";
}
