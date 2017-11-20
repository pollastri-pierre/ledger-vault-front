//@flow
import Query from "../../restlay/Query";
import type { Account } from "../../data/types";

/**
 * Calculate the fee for a given account (in the account currency)
 * (used when creating a new operation)
 */

type Input = {
  account: Account,
  speed: "slow" | "medium" | "fast"
};
type Response = {
  value: number
};

// e.g. /calculate-fee/bitcoin/slow
const uri = ({ account, speed }) =>
  `/calculate-fee/${account.currency.name}/${speed}`;

export default class AccountCalculateFeeQuery extends Query<Input, Response> {
  uri = uri(this.props);
  cacheMaxAge = 60;
}
