// @flow

import React from "react";
import connectData from "restlay/connectData";
import GroupHistoryQuery from "api/queries/GroupHistoryQuery";
import EntityHistory from "components/EntityHistory";
import SpinnerCard from "components/spinners/SpinnerCard";

type Props = {
  history: Array<any>,
};

const GroupHistory = ({ history }: Props) => (
  <EntityHistory history={history} />
);

const RenderLoading = () => <SpinnerCard />;
export default connectData(GroupHistory, {
  RenderLoading,
  queries: {
    history: GroupHistoryQuery,
  },
  propsToQueryParams: props => ({
    groupID: props.group.id,
  }),
});
