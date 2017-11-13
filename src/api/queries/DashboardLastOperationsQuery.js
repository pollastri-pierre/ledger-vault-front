//@flow
import Query from "../../restlay/Query";
import schema from "../../data/schema";
import type { Operation } from "../../data/types";

type In = void;
type Res = Operation[];

export default class DashboardLastOperationsQuery extends Query<In, Res> {
  uri = "/dashboard/last-operations";
  responseSchema = [schema.Operation];
}
