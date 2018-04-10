//@flow
import ActivityQuery from "api/queries/ActivityQuery";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import type { Activities } from "data/types";
import connectData from "restlay/connectData";
import ActivityList from "../ActivityList";
import Bell from "../icons/full/Bell";
import ModalRoute from "../ModalRoute";
import PopBubble from "../utils/PopBubble";
import { withStyles } from "material-ui/styles";
import { mixinHoverSelected } from "shared/common";
import CircularProgress from "material-ui/Progress/CircularProgress";
import colors from "shared/colors";

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
        maxHeight: 490,
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
        activities: ActivityCommon[],
        loading: boolean,
        history: *,
        classes: { [_: $Keys<typeof styles>]: string },
        location: *
    },
    *
> {
    static defaultProps = {
        loading: false
    };

    state = {
        bubbleOpened: false
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

    render() {
        const { profile, location, classes, activities, loading } = this.props;
        const { bubbleOpened } = this.state;
        const t = this.context.translate;
        const unseenActivityCount = activities
            ? activities.reduce(
                  (count, activity) => count + (!activity.seen ? 1 : 0),
                  0
              )
            : 0;
        return (
            <span className={classes.clickable}>
                <div
                    onClick={this.onClickActivityCard}
                    ref={this.onActivityRef}
                    className={classes.base}
                >
                    <Bell className={classes.icon} />
                    {!!unseenActivityCount && (
                        <div className={classes.bullet} />
                    )}
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

export default connectData(withStyles(styles)(ActivityCard), {
    RenderLoading,
    queries: {
        activities: ActivityQuery
    }
});
