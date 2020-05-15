// @flow

import React, { useMemo } from "react";

import connectData from "restlay/connectData";
import SearchGroups from "api/queries/SearchGroups";
import { WidgetLoading } from "components/widgets/Widget";
import { RestlayTryAgain } from "components/TryAgain";
import { GroupsList } from "components/lists";

import type { Connection } from "restlay/ConnectionQuery";
import type { Group } from "data/types";

type Props = {
  groupsConnection: Connection<Group>,
};

const UserDetailsGroups = (props: Props) => {
  const { groupsConnection } = props;
  const groups = useMemo(
    () => groupsConnection.edges.map((edge) => edge.node),
    [groupsConnection],
  );
  return <GroupsList display="grid" tileWidth={250} groups={groups} />;
};

export default connectData(UserDetailsGroups, {
  RenderLoading: () => <WidgetLoading height={220} />,
  RenderError: RestlayTryAgain,
  queries: {
    groupsConnection: SearchGroups,
  },
  propsToQueryParams: (props) => ({
    members: props.userID,
    pageSize: -1,
  }),
});
