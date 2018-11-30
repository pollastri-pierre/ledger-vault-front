//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityCommon } from "data/types";
import colors, { hexToRgbA } from "shared/colors";

import DateFormat from "../DateFormat";

const styles = {
  activity: {
    paddingTop: 17,
    paddingBottom: 17,
    borderBottom: "1px solid " + colors.argile
  },
  uppercase: {
    textTransform: "uppercase"
  },
  clickable: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  activityMessage: {
    fontSize: 11,
    textAlign: "left",
    width: "calc(100% - 115px)",
    marginLeft: 30,
    display: "inline-block",
    verticalAlign: "top",
    color: colors.black,
    lineHeight: "19px",
    "&.seen": {
      color: hexToRgbA(colors.black, 0.5)
    },
    "> a": {
      textDecoration: "none"
    }
  },
  dateWrap: {
    width: 50,
    display: "inline-block",
    verticalAlign: "top",
    color: colors.lead,
    fontWeight: 600,
    "&.seen": {
      color: hexToRgbA(colors.lead, 0.5)
    }
  },
  date: {
    fontSize: 10,
    lineHeight: "18px",
    textAlign: "right"
  },
  bulletWrap: {
    width: 15,
    display: "inline-block",
    verticalAlign: "top"
  },
  bullet: {
    width: 6,
    height: 6,
    backgroundColor: colors.grenade,
    borderRadius: "50%",
    marginTop: 5
  }
};

class ActivityLine extends Component<
  {
    activity: ActivityCommon,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *,
    children: *
  },
  *
> {
  getSeenClass = seen => {
    return seen ? "seen" : "";
  };

  componentDidMount() {
    //this.props.onRef(ReactDOM.findDOMNode(this));
  }

  render() {
    const { activity, classes, children } = this.props;

    return (
      <div>
        <div className={classes.bulletWrap}>
          {!activity.seen && <div className={classes.bullet} />}
        </div>
        <div
          className={classnames(
            classes.dateWrap,
            this.getSeenClass(activity.seen)
          )}
        >
          <div className={classnames(classes.uppercase, classes.date)}>
            <DateFormat date={activity.created_on} />
          </div>
        </div>
        <span
          className={classnames(
            classes.activityMessage,
            this.getSeenClass(activity.seen)
          )}
        >
          {children}
        </span>
      </div>
    );
  }
}

export default withStyles(styles)(ActivityLine);
