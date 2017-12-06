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

// Fetch data for the Quicklook graph. data should be baked with all Account's operations
// We will assume that there are datapoints for Edges too.
// e.g. asking for range="year":
//   - the first datapoint must be [one year ago,value]
//   - the last datapoint must be [exactly now,value]
// thay way we can display a seamless graph AND we always have 2 points in the data
// it is assumed that there are only datapoint when an operation happened,
// that way client can choose to do linear interp between points VS stepped rendering

export default class AccountQuicklookDataQuery extends Query<Input, Response> {
  uri = `/accounts/${this.props.accountId}/balance?range=${this.props.range}`;
  cacheMaxAge = 30;
}
