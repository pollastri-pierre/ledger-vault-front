// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityCommon } from "data/types";
import colors, { opacity } from "shared/colors";

import DateFormat from "components/DateFormat";
import Box from "components/base/Box";
import Text from "components/base/Text";

const styles = {
  clickable: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  activityMessage: {
    "&.seen": {
      color: opacity(colors.black, 0.5),
    },
    "> a": {
      textDecoration: "none",
    },
  },
  dateWrap: {
    color: colors.lead,
    fontWeight: 600,
    "&.seen": {
      color: opacity(colors.lead, 0.5),
    },
  },
  bullet: {
    width: 6,
    height: 6,
    backgroundColor: colors.grenade,
    borderRadius: "50%",
  },
};

type Props = {
  activity: ActivityCommon,
  classes: { [_: $Keys<typeof styles>]: string },
  children: *,
};

// NOTE: a lot more to refactor, did some basics because it was too ugly
class ActivityLine extends Component<Props> {
  getSeenClass = seen => (seen ? "seen" : "");

  render() {
    const { activity, classes, children } = this.props;

    return (
      <Box>
        <Box horizontal flow={10}>
          {!activity.seen && <Box mt={5} className={classes.bullet} />}
          <Box
            className={classnames(
              classes.dateWrap,
              this.getSeenClass(activity.seen),
            )}
          >
            <Text uppercase small>
              <DateFormat date={activity.created_on} />
            </Text>
          </Box>
        </Box>
        <Text
          small
          className={classnames(
            classes.activityMessage,
            this.getSeenClass(activity.seen),
          )}
        >
          {children}
        </Text>
      </Box>
    );
  }
}

export default withStyles(styles)(ActivityLine);
