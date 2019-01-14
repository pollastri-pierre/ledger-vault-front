// @flow
import React, { Component } from "react";
import type { Unit } from "data/types";
import LineChart from "components/LineChart";
import AccountQuicklookDataQuery from "api/queries/AccountQuicklookDataQuery";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import connectData from "restlay/connectData";
import type {
  Range,
  Response as Balance
} from "api/queries/AccountQuicklookDataQuery";
// import { formatCurrencyUnit } from "data/currency";

type Filter = $Keys<Balance>;

type Props = {
  balance: Balance,
  currencyUnit: Unit,
  currencyColor: string,
  filter: Filter
};

type State = {};

class Quicklook extends Component<Props, State> {
  render() {
    const { balance, currencyUnit, currencyColor, filter } = this.props;
    const selectedBalance = balance[filter].map(dataPoint => [
      dataPoint[0]
      // parseFloat(formatCurrencyUnit(currencyUnit, dataPoint[1]))
    ]);
    return (
      selectedBalance.length && (
        <div className="content">
          <div className="quickLookGraphWrap">
            <LineChart
              key={filter}
              data={selectedBalance}
              color={currencyColor}
              formatTooltip={(amount: number): string =>
                `${currencyUnit.code} ${amount} `
              }
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
