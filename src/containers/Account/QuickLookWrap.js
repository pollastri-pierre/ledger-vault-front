//@flow
import React, { Component } from "react";
import type { BalanceEntity, Unit } from "../../data/types";
import QuicklookGraph from "./QuicklookGraph";
import BalanceQuery from "../../api/queries/BalanceQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";

type Props = {
  accountId: string,
  granularity: number,
  balance: BalanceEntity,
  currencyUnit: Unit,
  dateRange: Array<*>,
  currencyColor: string,
  filter: string
};

type State = {};

export class QuicklookWrap extends Component<Props, State> {
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
    balance: BalanceQuery
  },
  propsToQueryParams: props => ({
    accountId: props.accountId,
    granularity: props.granularity,
    range: props.dateRange[1] - props.dateRange[0]
  }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
