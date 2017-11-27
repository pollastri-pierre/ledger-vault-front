//@flow
import Query from "../../restlay/Query";
import type { Account } from "../../data/types";

type Input = {
  accountId: string,
  granularity: string,
  range: ?number
};
type Response = Account;

// Fetch a specific account
export default class AccountQuery extends Query<Input, Response> {
  uri = `/balance/${this.props.accountId}/${this.props.granularity}/${
    this.props.range
  }/`;
}
