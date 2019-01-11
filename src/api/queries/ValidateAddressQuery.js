//@flow
import Query from "restlay/Query";
import type { Currency } from "@ledgerhq/live-common/lib/types";

type Input = {
  address: string,
  currency: Currency
};
type Response = {
  valid: boolean
};

// e.g. /valid-address/bitcoin?address=1gre1noAY9HiK2qxoW8FzSdjdFBcoZ5fV
const uri = ({ address, currency }: Input) =>
  `/validation/${currency.id}/${encodeURIComponent(address)}`;

// Calculate the fee for a given account (in the account currency)
// (used when creating a new operation)
export default class ValidateAddressQuery extends Query<Input, Response> {
  uri = uri(this.props);
}
