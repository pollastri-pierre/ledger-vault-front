//@flow
import Query from "../../restlay/Query";
import type { BalanceEntity } from "../../data/types";

type Input = {
  accountId: string,
  granularity: number,
  range: number
};
type Response = BalanceEntity;

// Fetch a specific account
export default class BalanceQuery extends Query<Input, Response> {
  uri = `/balance/${this.props.accountId}/${this.props.granularity}${
    this.props.range ? "/" + this.props.range : ""
  }/`;
}
