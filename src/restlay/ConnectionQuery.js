// @flow
import { denormalize } from "normalizr-gre";
import type { Store, FetchParams } from "./dataStore";

export type Connection<T> = {
  edges: Array<{
    cursor: number,
    node: T,
  }>,
  pageInfo: {
    hasNextPage: boolean,
  },
};

// extends Query idea to add connection concept, an API that paginates
// see original idea: https://github.com/LedgerHQ/ledger-vault-front/issues/30#issuecomment-346409116
class ConnectionQuery<In, Node> {
  props: In;

  fetchParams: FetchParams;

  // define the URI to hit for the API. can also pass a template function
  uri: string;

  // define the Schema of the edges[*].node field in the connection object.
  nodeSchema: Object = {};

  // handler to eventually filter items from query results
  filter: ?(Object) => boolean;

  // TODO: type this properly...
  deserialize: any;

  constructor(props: In, fetchParams: FetchParams) {
    this.props = props;
    this.fetchParams = fetchParams;
  }

  // Overridable
  getPaginationURLParams(first?: number, after?: string): Object {
    const params = {};
    if (first !== undefined) params.first = first;
    if (after !== undefined) params.after = after;
    return params;
  }

  // ...Internals...

  pageSize = -1;

  setSize(size: number) {
    this.pageSize = size;
  }

  getSize() {
    return this.pageSize;
  }

  // HACK this is a memory so we know if we need to reset or not the connection (if you start a new ConnectionQuery, it will starts from scratch)
  firstQueryDone = false;

  getCacheKey(): string {
    return this.uri;
  }

  getResponseSchema() {
    return {
      edges: [{ node: this.nodeSchema }],
    };
  }

  getFilter() {
    return this.filter;
  }

  getDeserialize() {
    return this.deserialize;
  }

  getResponse(result: Object, store: Store): Connection<Node> {
    return denormalize(result, this.getResponseSchema(), store.entities);
  }
}
export default ConnectionQuery;
