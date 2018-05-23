//@flow
import MarkActivityAsReadMutation from "api/mutations/MarkActivityAsReadMutation";
import type { ActivityCommon } from "data/types";
import type { RestlayEnvironment } from "restlay/connectData";
import ClearActivityMutation from "api/mutations/ClearActivityMutation";
import ActivityQuery from "api/queries/ActivityQuery";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import connectData from "restlay/connectData";
import { DATA_FETCHED } from "restlay/dataStore";
import ActivityList from "../ActivityList";
import Bell from "../icons/full/Bell";
import PopBubble from "../utils/PopBubble";
import { withStyles } from "material-ui/styles";
import CircularProgress from "material-ui/Progress/CircularProgress";
import colors from "shared/colors";
import { normalize } from "normalizr-gre";

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
    border: "2px solid " + colors.night,
    top: 5,
    right: 11
  }
};

class ActivityCard extends Component<
  {
    activities?: ActivityCommon[],
    onNewActivity?: Function,
    restlay?: RestlayEnvironment,
    loading: boolean,
    classes: { [_: $Keys<typeof styles>]: string },
    match: *
  },
  *
> {
  state = {
    bubbleOpened: false
  };

  componentDidMount() {
    const socket = openSocket.connect("https://localhost:3033");
    const myAuthToken = getLocalStorageToken();
    let self = this;
    socket.on("connect", function() {
      socket.emit("authenticate", { token: myAuthToken });
    });
    socket.on("admin", function(activity) {
      //FIXME why is it fired twice ??
      if (self.props.onNewActivity) {
        self.props.onNewActivity(activity);
      }
    });
  }

  static defaultProps = {
    loading: false
  };

  // FIXME translate should be a component so i don't have to depend on context
  static contextTypes = {
    translate: PropTypes.func.isRequired
  };

  anchorEl: *;

  onActivityRef = (ref: *) => {
    this.anchorEl = ref;
  };

  onCloseBubble = () => {
    this.setState({ bubbleOpened: false });
  };

  onClickActivityCard = (/* event: * */) => {
    this.setState({
      bubbleOpened: !this.state.bubbleOpened
    });
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
    const { classes, activities, loading, match } = this.props;
    const { bubbleOpened } = this.state;
    const t = this.context.translate;
    const unseenActivityCount = activities
      ? activities.reduce(
          (count, activity) => count + (!activity.seen ? 1 : 0),
          0
        )
      : 0;
    activities &&
      activities.sort((a, b) => {
        return new Date(b.created_on) - new Date(a.created_on);
      });
    return (
      <span className={classes.clickable}>
        <div
          onClick={this.onClickActivityCard}
          ref={this.onActivityRef}
          className={classes.base}
        >
          <Bell className={classes.icon} />
          {!!unseenActivityCount && <div className={classes.bullet} />}
          <div className="content-header-button-text">
            {t("actionBar.activity")}
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

const RenderLoading = withStyles(styles)(({ classes }) => (
  <ActivityCard loading={true} classes={classes} />
));

const mapDispatchToProps = (dispatch, props) => ({
  onNewActivity: activity => {
    const queryOrMutation = new ActivityQuery();
    const data = [activity, ...props.activities];
    const result = normalize(data, queryOrMutation.getResponseSchema() || {});

    dispatch({
      type: DATA_FETCHED,
      result,
      queryOrMutation,
      cacheKey: queryOrMutation.getCacheKey()
    });
    return data;
  }
});

export default withStyles(styles)(
  connectData(connect(undefined, mapDispatchToProps)(ActivityCard), {
    RenderLoading,
    queries: {
      activities: ActivityQuery
    }
  })
);
