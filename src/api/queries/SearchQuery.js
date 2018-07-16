//@flow
import ConnectionQuery from "restlay/ConnectionQuery";
import schema from "data/schema";
import type { Operation } from "data/types";
import queryString from "query-string";

type In = {
  keywords: ?string,
  accountId: ?string,
  currencyName: ?string
};
type Node = Operation;

const uri = ({ keywords, accountId, currencyName }: In) => {
  const query = {};
  if (keywords) query.keywords = keywords;
  if (accountId) query.accountId = accountId;
  if (currencyName) query.currencyName = currencyName;
  const q = queryString.stringify(query);
  return "/search/operations" + (q ? "?" : "") + q;
};

// Search operations
// This API is paginated, refer to ConnectionQuery documentation
export default class SearchQuery extends ConnectionQuery<In, Node> {
  uri = uri(this.props);
  nodeSchema = schema.Operation;
}
