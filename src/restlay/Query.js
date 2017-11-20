//@flow
import type { Store } from "./dataStore";
import { denormalize } from "normalizr";

// A query maps to a GET on the api, it is idempotent to fetch and can be cached
export default class Query<Input, Response> {
  props: Input;

  // define the URI to hit for the API. can also pass a template function
  uri: string;
  // the schema of the expected HTTP response. defined using normalizr-style schema.
  responseSchema: Object | Array<Object> = {};
  // on a GET, the maximum amount of time (seconds) will be considered fresh and we don't need to refetch. we want the front app to not always refetch the data (NB maybe we could use HTTP Cache-Control but this is a simpler take on the problem)
  cacheMaxAge: number = 0;
  // The response HTTP Code that will trigger the user to logout automatically
  logoutUserIfStatusCode: ?number;

  uri: string;
  notif: ?{ title: string, content: string };
  responseSchema: ?(Object | Array<Object>);

  constructor(props: Input) {
    this.props = props;
  }

  getCacheKey(): string {
    return this.uri;
  }

  // Internal

  getResponse(result: Object, store: Store): Response {
    return denormalize(result, this.responseSchema, store.entities);
  }
}
