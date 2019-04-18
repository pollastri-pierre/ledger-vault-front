// @flow

import React from "react";
import connectData from "restlay/connectData";
import AccountHistoryQuery from "api/queries/AccountHistoryQuery";
import EntityHistory from "components/EntityHistory";
import SpinnerCard from "components/spinners/SpinnerCard";

type Props = {
  history: Array<any>,
};

const AccountHistory = ({ history }: Props) => (
  <EntityHistory history={history} />
);

const RenderLoading = () => <SpinnerCard />;
export default connectData(AccountHistory, {
  RenderLoading,
  queries: {
    history: AccountHistoryQuery,
  },
  propsToQueryParams: props => ({
    accountID: props.account.id,
  }),
});
