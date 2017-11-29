//@flow
import Query from "../../restlay/Query";
import type { Account } from "../../data/types";

export type Speed = "slow" | "medium" | "fast";

type Input = {
  account: Account,
  speed: Speed
};
type Response = {
  value: number
};

// e.g. /calculate-fee/bitcoin/slow
const uri = ({ account, speed }: Input) =>
  `/calculate-fee/${account.currency.name}/${speed}`;

// Calculate the fee for a given account (in the account currency)
// (used when creating a new operation)
export default class AccountCalculateFeeQuery extends Query<Input, Response> {
  uri = uri(this.props);
  cacheMaxAge = 60;
}
