// @flow

import React from "react";
import connectData from "restlay/connectData";
import TransactionHistoryQuery from "api/queries/TransactionHistoryQuery";
import EntityHistory from "components/EntityHistory";
import SpinnerCard from "components/spinners/SpinnerCard";

type Props = {
  history: Array<any>,
};

const AccountHistory = ({ history }: Props) => (
  <EntityHistory history={history} />
);

export default connectData(AccountHistory, {
  RenderLoading: SpinnerCard,
  queries: {
    history: TransactionHistoryQuery,
  },
  propsToQueryParams: props => ({
    transactionID: props.transaction.id,
  }),
});
