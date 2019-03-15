// @flow
import MarkActivityAsReadMutation from "api/mutations/MarkActivityAsReadMutation";
import { translate } from "react-i18next";
import { FaRegBell } from "react-icons/fa";
import type { Translate } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import ClearActivityMutation from "api/mutations/ClearActivityMutation";
import ActivityQuery from "api/queries/ActivityQuery";
import React, { Component } from "react";
import { getLocalStorageToken } from "redux/modules/auth";
import connectData from "restlay/connectData";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import colors from "shared/colors";
import io from "socket.io-client";
import PopBubble from "../utils/PopBubble";
import ActivityList from "../legacy/ActivityList";

const styles = {
  base: {
    position: "relative"
  },
  link: {
    color: "black",
    textTransform: "uppercase"
  },
  popover: {
    width: 380,
    paddingRight: 40,
    paddingLeft: 40,
    paddingBottom: 30,
    paddingTop: 40,
    marginLeft: 30
  },
  icon: {
    height: 16,
    fill: "white",
    marginBottom: 5
  },
  clickable: {
    "&:hover": {
      cursor: "pointer"
    }
  },
  bullet: {
    backgroundColor: colors.grenade,
    width: 10,
    height: 10,
    borderRadius: "50%",
    position: "absolute",
    border: `2px solid ${colors.night}`,
    top: 5,
    right: 11
  }
};

class ActivityCard extends Component<
  {
    activities?: *,
    onNewActivity: Function,
    restlay?: RestlayEnvironment,
    loading?: boolean,
    t: Translate,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  state = {
    bubbleOpened: false
  };

  componentDidMount() {
    const url = process.env.NOTIFICATION_URL || "/";
    const path = process.env.NOTIFICATION_PATH || "/notification/socket.io";
    const socket = io.connect(url, { path });
    const myAuthToken = getLocalStorageToken();
    socket.on("connect", () => {
      socket.emit("authenticate", {
        token: myAuthToken,
        orga: this.props.match.params.orga_name
      });
    });
    socket.on(`${this.props.match.params.orga_name}/admin`, () => {
      // FIXME why is it fired twice ??
      if (this.props.onNewActivity && this.props.restlay) {
        this.props.restlay.fetchQuery(new ActivityQuery());
      }
    });
  }

  static defaultProps = {
    loading: false
  };

  anchorEl: *;

  onActivityRef = (ref: *) => {
    this.anchorEl = ref;
  };

  onCloseBubble = () => {
    this.setState({ bubbleOpened: false });
  };

  onClickActivityCard = (/* event: * */) => {
    this.setState(state => ({
      bubbleOpened: !state.bubbleOpened
    }));
  };

  markAsSeenRequest = async business_action_ids => {
    const { restlay } = this.props;
    if (restlay) {
      await restlay.commitMutation(
        new MarkActivityAsReadMutation(business_action_ids)
      );
      await restlay.fetchQuery(new ActivityQuery());
    }
  };

  clearAllRequest = async business_action_ids => {
    const { restlay } = this.props;
    if (restlay) {
      await restlay.commitMutation(
        new ClearActivityMutation(business_action_ids)
      );
      await restlay.fetchQuery(new ActivityQuery());
    }
  };

  render() {
    const { classes, activities, loading, match, t } = this.props;
    const { bubbleOpened } = this.state;
    const unseenActivityCount = activities
      ? activities.reduce(
          (count, activity) => count + (!activity.seen ? 1 : 0),
          0
        )
      : 0;
    activities &&
      activities.sort(
        (a, b) => new Date(b.created_on) - new Date(a.created_on)
      );
    return (
      <span className={classes.clickable}>
        <div
          onClick={this.onClickActivityCard}
          ref={this.onActivityRef}
          className={classes.base}
        >
          <FaRegBell size={18} />
          {!!unseenActivityCount && <div className={classes.bullet} />}
          <div className="content-header-button-text">
            {t("actionBar:activity")}
          </div>
        </div>

        <PopBubble
          classes={{ paper: classes.popover }}
          anchorEl={this.anchorEl}
          open={bubbleOpened}
          onClose={this.onCloseBubble}
          directiontransform="right"
          direction="center"
        >
          <div onClick={this.onCloseBubble}>
            {!loading && (
              <ActivityList
                activities={activities}
                unseenActivityCount={unseenActivityCount}
                markAsSeenRequest={this.markAsSeenRequest}
                clearAllRequest={this.clearAllRequest}
                match={match}
              />
            )}
            {loading && <CircularProgress />}
          </div>
        </PopBubble>
      </span>
    );
  }
}

const RenderLoading = withStyles(styles)(
  translate()(({ classes, match, ...props }) => (
    <ActivityCard
      loading
      classes={classes}
      match={match}
      onNewActivity={() => ({})}
      {...props}
    />
  ))
);

export default withStyles(styles)(
  connectData(translate()(ActivityCard), {
    RenderLoading,
    queries: {
      activities: ActivityQuery
    }
  })
);
