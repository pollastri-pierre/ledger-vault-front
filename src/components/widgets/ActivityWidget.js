// @flow

import React from "react";

import type { ActivityCommon } from "data/types";
import ActivityQuery from "api/queries/ActivityQuery";
import { ActivityList } from "components/lists";

import Widget, { connectWidget } from "./Widget";

type Props = {
  activities: ActivityCommon[],
};

function ActivityWidget(props: Props) {
  const { activities } = props;
  return (
    <Widget title="Activity">
      <ActivityList activities={activities} />
    </Widget>
  );
}

export default connectWidget(ActivityWidget, {
  height: 250,
  queries: {
    activities: ActivityQuery,
  },
});
