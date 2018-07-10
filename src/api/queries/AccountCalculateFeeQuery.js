//@flow
import Mutation from "restlay/Mutation";
export const speeds = {
  slow: "slow",
  normal: "normal",
  fast: "fast"
};
export type Speed = $Values<typeof speeds>;

type Input = {
  operation: {
    amount: number,
    fee_level: Speed,
    recipient: string
  },
  accountId: number
};

type Response = {
  value: number
};

// Calculate the fee for a given account (in the account currency)
// (used when creating a new operation)
export default class AccountCalculateFeeQuery extends Mutation<
  Input,
  Response
> {
  method = "POST";
  uri = `/accounts/${this.props.accountId}/operations/fees`;

  getBody() {
    return this.props.operation;
  }
}
