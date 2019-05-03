// @flow
import { BigNumber } from "bignumber.js";
import Mutation from "restlay/Mutation";
import type { TransactionGetFees } from "data/types";

export const speeds = {
  slow: "slow",
  normal: "normal",
  fast: "fast",
};

export type Speed = $Values<typeof speeds>;

type Input = {
  accountId: number,
  txGetFees: TransactionGetFees,
};

type Response = {
  value: {
    fees: string,
    gas_limit?: ?BigNumber,
    gas_price?: ?BigNumber,
    max_amount?: ?BigNumber,
  },
};

// Calculate the fee for a given account (in the account currency)
// (used when creating a new transaction)
export default class AccountCalculateFeeQuery extends Mutation<
  Input,
  Response,
> {
  method = "POST";

  uri = `/accounts/${this.props.accountId}/transactions/fees`;

  showError = false;

  getBody() {
    const { txGetFees } = this.props;
    return {
      ...txGetFees,
      amount: txGetFees.amount.toFixed(),
      gas_limit: txGetFees.gas_limit ? txGetFees.gas_limit.toFixed() : null,
      gas_price: txGetFees.gas_price ? txGetFees.gas_price.toFixed() : null,
    };
  }

  deserialize = res => ({
    ...res,
    fees: BigNumber(res.fees),
    gas_price: res.gas_price ? BigNumber(res.gas_price) : null,
    gas_limit: res.gas_limit ? BigNumber(res.gas_limit) : null,
    max_amount: res.max_amount ? BigNumber(res.max_amount) : null,
  });
}
