// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityGeneric } from "data/types";
import colors from "shared/colors";

import ActivityLine from "components/ActivityLine";

const styles = {
  base: {
    fontSize: 10,
    position: "relative",
    paddingBottom: 44,
  },
  link: {
    color: "black",
    textTransform: "uppercase",
  },
  popover: {},
  icon: {
    width: 16,
    fill: "white",
    marginBottom: 5,
  },
  clickable: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  buttonWrap: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    position: "fixed",
    bottom: 0,
    backgroundColor: colors.white,
    left: 0,
  },
  button: {
    fontSize: 11,
    color: colors.steel,
    fontWeight: 600,
    position: "relative",
    margin: 30,
    "&:hover": {
      color: colors.ocean,
      "&:before": {
        height: 5,
      },
    },
    "&:before": {
      content: "''",
      height: 0,
      width: "100%",
      bottom: -30,
      display: "block",
      backgroundColor: colors.ocean,
      position: "absolute",
      transition: "height 200ms ease",
    },
  },
  newActivities: {
    color: colors.black,
    fontSize: 11,
    fontWeight: 600,
    paddingBottom: 20,
    paddingTop: 20,
    paddingLeft: 40,
    position: "fixed",
    width: "100%",
    backgroundColor: colors.white,
    left: 0,
    top: 0,
  },
  listWrap: {
    width: "100%",
    overflow: "hidden",
  },
  list: {
    paddingRight: 20,
    maxHeight: 360,
    overflow: "scroll",
    width: "calc(100% + 20px)",
  },
};

class ActivityList extends Component<
  {
    activities: ActivityGeneric[],
    unseenActivityCount: number,
    markAsSeenRequest: Function,
    clearAllRequest: Function,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *,
  },
  *,
> {
  firstElem: * = null;

  firstElemInitialTopPos = 0;

  state = {
    timer: null, // eslint-disable-line react/no-unused-state
  };

  list: ?HTMLDivElement;

  componentDidMount() {
    // const { list } = this;
    // if (list) list.addEventListener("scroll", this.onScroll);
    // this.timeout(500).promise.then(this.markVisibleActivitiesAsSeen);
  }

  componentWillUnmount() {
    const { list } = this;
    if (list) list.removeEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    this.markVisibleActivitiesAsSeen();
  };

  markVisibleActivitiesAsSeen = () => {
    const { activities } = this.props;

    if (this.firstElem) {
      const actualTop = this.firstElem.getBoundingClientRect().top - 146;
      const height = this.firstElem.getBoundingClientRect().height;
      const nb_diff = Math.abs(Math.floor(actualTop / height));
      const business_action_ids = [];
      for (let i = nb_diff; i < activities.length && i < nb_diff + 5; i++) {
        if (!activities[i].seen)
          business_action_ids.push(activities[i].business_action.id);
      }
      this.cancelAndMakeRequestMarkAsSeen(business_action_ids);
    }
  };

  cancelAndMakeRequestMarkAsSeen = business_action_ids => {
    const { markAsSeenRequest } = this.props;

    this.setState(prevState => {
      if (prevState.timer) {
        prevState.timer.cancel();
      }
      const timer = this.timeout(3000);
      timer.promise.then(() => {
        if (business_action_ids.length) markAsSeenRequest(business_action_ids);
      });
      return { timer };
    });
  };

  markAllAsRead = () => {
    const { activities, markAsSeenRequest } = this.props;
    const business_action_ids = [];
    activities.forEach(activity => {
      if (!activity.seen) business_action_ids.push(activity.business_action.id);
    });
    markAsSeenRequest(business_action_ids);
  };

  clearAll = () => {
    const { activities, clearAllRequest } = this.props;
    const business_action_ids = [];
    activities.forEach(activity => {
      if (activity.show) business_action_ids.push(activity.business_action.id);
    });
    clearAllRequest(business_action_ids);
  };

  timeout = ms => {
    let timeout;

    const promise = new Promise(resolve => {
      timeout = setTimeout(() => {
        resolve("timeout done");
      }, ms);
    });

    return {
      promise,
      cancel() {
        clearTimeout(timeout);
      }, // return a canceller as well
    };
  };

  render() {
    const {
      activities,
      classes,
      unseenActivityCount,
      match,
      markAsSeenRequest,
    } = this.props;
    return (
      <div>
        <div className={classes.newActivities}>
          {activities.length === 0 && "NO ACTIVITIES AVAILABLE"}
          {unseenActivityCount > 1 && `${unseenActivityCount} NEW ACTIVITIES`}
          {unseenActivityCount === 1 && `${unseenActivityCount} NEW ACTIVITY`}
        </div>
        {!!activities.length && (
          <div className={classes.base}>
            <div className={classes.listWrap}>
              <div
                className={classes.list}
                ref={elem => {
                  this.list = elem;
                }}
              >
                {activities.map(
                  activity =>
                    activity.show && (
                      <ActivityLine
                        match={match}
                        markAsSeenRequest={markAsSeenRequest}
                        activity={activity}
                        /* onRef={elem => {
                                                    if (id == 0) {
                                                        this.firstElem = elem;
                                                        this.firstElemInitialTopPos = elem.getBoundingClientRect().top;
                                                    }
                                                }} */
                        key={activity.id}
                      />
                    ),
                )}
              </div>
            </div>
            {!!unseenActivityCount && (
              <div className={classes.buttonWrap}>
                {/* <span */}
                {/*     className={classnames( */}
                {/*         classes.button, */}
                {/*         classes.clickable */}
                {/*     )} */}
                {/*     onClick={this.clearAll} */}
                {/* > */}
                {/*     CLEAR ALL */}
                {/* </span> */}
                <span
                  className={classnames(classes.button, classes.clickable)}
                  onClick={this.markAllAsRead}
                >
                  MARK AS READ
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ActivityList);
