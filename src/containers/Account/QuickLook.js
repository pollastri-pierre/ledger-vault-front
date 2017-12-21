//@flow
import React, { Component } from "react";
import type { Unit } from "../../data/types";
import LineChart from "../../components/LineChart";
import AccountQuicklookDataQuery from "../../api/queries/AccountQuicklookDataQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";
import type {
  Range,
  Response as Balance
} from "../../api/queries/AccountQuicklookDataQuery";

type Filter = $Keys<Balance>;

type Props = {
  accountId: string,
  balance: Balance,
  currencyUnit: Unit,
  range: Range,
  currencyColor: string,
  dateRange: Array<*>,
  filter: Filter
};

type State = {};

class Quicklook extends Component<Props, State> {
  render() {
    const {
      balance,
      currencyUnit,
      dateRange,
      currencyColor,
      filter
    } = this.props;
    const selectedBalance = balance[filter];
    return (
      selectedBalance.length && (
        <div className="content">
          <div className="quickLookGraphWrap">
            <LineChart
              dateRange={dateRange}
              data={selectedBalance}
              currencyUnit={currencyUnit}
              currencyColor={currencyColor}
            />
          </div>
        </div>
      )
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <div className="content">
    <div className="quickLookGraphWrap">
      <TryAgain error={error} action={restlay.forceFetch} />
    </div>
  </div>
);

const RenderLoading = () => (
  <div className="content">
    <div className="quickLookGraphWrap">
      <SpinnerCard />
    </div>
  </div>
);

export default connectData(Quicklook, {
  queries: {
    balance: AccountQuicklookDataQuery
  },
  propsToQueryParams: (props: { accountId: string, range: Range }) => ({
    accountId: props.accountId,
    range: props.range
  }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
