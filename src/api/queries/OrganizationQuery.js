//@flow
import Query from "restlay/Query";

type Input = void;
type Response = *;

// Fetch all accounts
export default class OrganizationQuery extends Query<Input, Response> {
  uri = "/organization";
}
