// @flow
import { BigNumber } from "bignumber.js";
import Mutation from "restlay/Mutation";

type Input<P> = {|
  accountId: number,
  payload: P,
|};

export type FeesQueryResponse = {
  fees: ?BigNumber,
  fees_per_byte: ?BigNumber,
  gas_limit?: ?BigNumber,
  gas_price?: ?BigNumber,
  max_amount?: ?BigNumber,
};

// Calculate the fee for a given account (in the account currency)
// (used when creating a new transaction)
export default class AccountCalculateFeeQuery<P> extends Mutation<
  Input<P>,
  FeesQueryResponse,
> {
  method = "POST";

  uri = `/accounts/${this.props.accountId}/transactions/fees`;

  showError = false;

  getBody() {
    const body: Object = { ...this.props.payload };
    if (body.fees_level === "custom") {
      delete body.fees_level;
    }
    if (!body.fees_per_byte) {
      body.fees_per_byte = "0";
    }

    return body;
  }

  deserialize = res => ({
    ...res,
    fees: BigNumber(res.fees),
    gas_price: res.gas_price ? BigNumber(res.gas_price) : null,
    gas_limit: res.gas_limit ? BigNumber(res.gas_limit) : null,
    max_amount: res.max_amount ? BigNumber(res.max_amount) : null,
  });
}
