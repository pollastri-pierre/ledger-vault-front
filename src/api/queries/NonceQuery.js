//@flow
import Query from "restlay/Query";

type Input = *;
type Response = {
  nonce: string
};

// e.g. /valid-address/bitcoin?address=1gre1noAY9HiK2qxoW8FzSdjdFBcoZ5fV
const uri = () => "/nonce";

// get a nonce to sign from the API/HSM
// (used when approving an operation/account)
export default class NonceQuery extends Query<Input, Response> {
  uri = uri();
}
