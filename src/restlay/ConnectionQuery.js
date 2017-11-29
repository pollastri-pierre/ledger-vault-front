//@flow
import invariant from "invariant";
import Query from "./Query";
import type { Connection } from "./dataStore";

// extends Query to add connection concept, an API that paginates
export default class ConnectionQuery<
  In: { pageSizeVariableName: String },
  T
> extends Query<In, Connection<T>> {
  nodeSchema: Object = {};
  pageSizeVariableName: string;

  constructor(props: In) {
    super(props);
    invariant(
      typeof props.pageSizeVariableName === "string",
      "pageSizeVariableName must be provided to ConnectionQuery"
    );
    this.pageSizeVariableName = props.pageSizeVariableName;
  }

  getPaginationURLParams(first: number, after: string) {
    return { first, after };
  }

  getResponseSchema() {
    return {
      edges: [{ node: this.nodeSchema }]
    };
  }
}
