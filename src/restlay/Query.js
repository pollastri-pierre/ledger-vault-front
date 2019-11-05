// @flow
import { denormalize } from "normalizr-gre";
import type { Store, FetchParams } from "./dataStore";
import type { Deserializer } from "./types";

// A query maps to a GET on the api, it is idempotent to fetch and can be cached
export default class Query<Input, Response> {
  props: Input;

  fetchParams: FetchParams;

  // define the URI to hit for the API. can also pass a template function
  uri: string;

  // the schema of the expected HTTP response. defined using normalizr-style schema.
  responseSchema: Object | Array<Object> = {};

  // handler to eventually filter items from query results
  filter: ?(Object) => boolean;

  deserialize: ?Deserializer<any>;

  // on a GET, the maximum amount of time (seconds) will be considered fresh and we don't need to refetch. we want the front app to not always refetch the data (NB maybe we could use HTTP Cache-Control but this is a simpler take on the problem)
  cacheMaxAge: number = 120;

  // The response HTTP Code that will trigger the user to logout automatically
  logoutUserIfStatusCode: ?number; // FIXME technically this has nothing to do in this generic library model. not sure how put it in project specific only

  constructor(props: Input, fetchParams: FetchParams) {
    this.props = props;
    this.fetchParams = fetchParams;
  }

  showError = true;

  getResponseSchema() {
    return this.responseSchema;
  }

  getDeserialize() {
    return this.deserialize;
  }

  getFilter() {
    return this.filter;
  }

  getCacheKey(): string {
    return this.uri;
  }

  // Internal

  getResponse(result: Object, store: Store): Response {
    return denormalize(result, this.getResponseSchema(), store.entities);
  }
}
