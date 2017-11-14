//@flow
import Query from "../../restlay/Query";

type Input = {
  accountId: string,
  // this defines the time window AND the granularity of the data
  range: "year" | "month" | "week" | "day"
};
type DataPoint = [number, number]; // a [ timestamp, value ] tuple
type Response = {
  // the data is assumed to contains all dates of the given range at a specific granularity
  // (even if there where no transaction at that time)
  // e.g. for a day range of a 1h granularity, arrays would have 25 points
  balance: DataPoint[],
  countervalueBalance: DataPoint[]
};

export default class AccountQuicklookDataQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/data?range=${this.props.range}`;
  cacheMaxAge = 600;
}
