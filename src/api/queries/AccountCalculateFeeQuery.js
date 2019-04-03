// @flow
import { BigNumber } from "bignumber.js";
import Mutation from "restlay/Mutation";

export const speeds = {
  slow: "slow",
  normal: "normal",
  fast: "fast"
};
export type Speed = $Values<typeof speeds>;

type Input = {
  amount: BigNumber,
  fee_level?: Speed,
  gas_limit?: ?BigNumber,
  gas_price?: ?BigNumber,
  recipient: string
};

type Response = {
  value: {
    fees: string,
    gas_limit?: ?BigNumber,
    gas_price?: ?BigNumber
  }
};

// Calculate the fee for a given account (in the account currency)
// (used when creating a new operation)
export default class AccountCalculateFeeQuery extends Mutation<
  Input,
  Response
> {
  method = "POST";

  uri = `/accounts/${this.props.accountId}/operations/fees`;

  showError = false;

  getBody() {
    const { operation } = this.props;
    return {
      ...this.props.operation,
      amount: operation.amount.toFixed(),
      gas_limit: operation.gas_limit ? operation.gas_limit.toFixed() : null,
      gas_price: operation.gas_price ? operation.gas_price.toFixed() : null
    };
  }

  deserialize = res => ({
    ...res,
    fees: BigNumber(res.fees),
    gas_price: BigNumber(res.gas_price),
    gas_limit: BigNumber(res.gas_limit)
  });
}
