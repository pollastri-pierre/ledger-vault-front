// @flow

import React from "react";

import connectData from "restlay/connectData";
import EntityHistory from "components/EntityHistory";
import UserHistoryQuery from "api/queries/UserHistoryQuery";

type Props = {
  // TODO flowtype this
  history: Array<any>,
};

const UserDetailsHistory = ({ history }: Props) => (
  <div style={{ maxHeight: 500, overflow: "auto" }}>
    <EntityHistory history={history} />
  </div>
);

export default connectData(UserDetailsHistory, {
  queries: {
    history: UserHistoryQuery,
  },
  propsToQueryParams: props => ({
    userID: props.user.id,
  }),
});
