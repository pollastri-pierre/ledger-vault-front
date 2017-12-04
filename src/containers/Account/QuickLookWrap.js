//@flow
import React, { Component } from "react";
import type { BalanceEntity, Unit } from "../../data/types";
import QuicklookGraph from "./QuicklookGraph";
import AccountQuicklookDataQuery from "../../api/queries/AccountQuicklookDataQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";

type Props = {
  accountId: string,
  balance: BalanceEntity,
  currencyUnit: Unit,
  range: "year" | "month" | "week" | "day",
  currencyColor: string,
  dateRange: Array<*>,
  filter: string
};

type State = {};

export class QuicklookWrap extends Component<Props, State> {
  render() {
    const {
      balance,
      currencyUnit,
      range,
      dateRange,
      currencyColor,
      filter
    } = this.props;
    const selectedBalance = balance[filter];
    return (
      selectedBalance.length && (
        <div className="content">
          <div className="quickLookGraphWrap">
            <QuicklookGraph
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
  <TryAgain error={error} action={restlay.forceFetch} />
);

const RenderLoading = () => <SpinnerCard />;

export default connectData(QuicklookWrap, {
  queries: {
    balance: AccountQuicklookDataQuery
  },
  propsToQueryParams: props => ({
    accountId: props.accountId,
    range: props.range
  }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
