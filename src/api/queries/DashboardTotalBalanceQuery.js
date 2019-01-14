// @flow
import Query from "restlay/Query";

type Input = void;
type Response = {
  date: string, // the calculation time (probably "now")
  balance: number,
  currencyName: string,
  balanceHistory: {
    // this is the historically counter value balance at a given time in the past
    // we can't calculate it ourself because we need to know the rate at a given time
    yesterday: number,
    week: number,
    month: number
  },
  accountsCount: number,
  currenciesCount: number,
  membersCount: number
};

// fetch all data needed for the Dashboard Total Balance card
export default class DashboardTotalBalanceQuery extends Query<Input, Response> {
  uri = "/dashboard/total-balance";
}
