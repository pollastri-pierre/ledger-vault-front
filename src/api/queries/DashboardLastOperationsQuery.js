//@flow
import Query from "restlay/Query";
import schema from "data/schema";
import type { Operation } from "data/types";

type In = void;
type Res = Operation[];

// returns the N last operations from various accounts (probably not paginated)
export default class DashboardLastOperationsQuery extends Query<In, Res> {
  uri = "/operations/submitted";
  responseSchema = [schema.Operation];
}
