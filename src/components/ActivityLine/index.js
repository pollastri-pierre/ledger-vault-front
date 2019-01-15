// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityGeneric } from "data/types";
import colors from "shared/colors";

import ActivityFactory from "../ActivityFactory";

const styles = {
  activity: {
    paddingTop: 17,
    paddingBottom: 17,
    borderBottom: `1px solid ${colors.argile}`
  },
  clickable: {
    "&:hover": {
      cursor: "pointer"
    }
  }
};

class ActivityLine extends Component<
  {
    activity: ActivityGeneric,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *,
    markAsSeenRequest: Function
  },
  *
> {
  render() {
    const { activity, classes, match, markAsSeenRequest } = this.props;
    return (
      <div
        className={classnames(classes.clickable, classes.activity)}
        onClick={() => {
          if (!activity.seen) {
            markAsSeenRequest([activity.business_action.id]);
          }
        }}
      >
        {ActivityFactory.build(activity, match)}
      </div>
    );
  }
}

export default withStyles(styles)(ActivityLine);
