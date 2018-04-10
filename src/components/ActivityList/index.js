import CircularProgress from "material-ui/Progress/CircularProgress";
import connectData from "restlay/connectData";
import ActivityQuery from "api/queries/ActivityQuery";
import { withStyles } from "material-ui/styles";
import type { ActivityCommon } from "data/types";
import React, { Component } from "react";
import Activity from "../Activity";
import classnames from "classnames";
import colors from "shared/colors";

const styles = {
    base: {
        fontSize: 10
    },
    link: {
        color: "black",
        textTransform: "uppercase"
    },
    popover: {},
    icon: {
        width: 16,
        fill: "white",
        marginBottom: 5
    },
    clickable: {
        "&:hover": {
            cursor: "pointer"
        }
    },
    buttonWrap: {
        paddingTop: 30,
        paddingBottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between"
    },
    button: {
        fontSize: 11,
        color: colors.steel,
        fontWeight: 600,
        position: "relative",
        "&:hover": {
            color: colors.ocean,
            "&:before": {
                height: 5
            }
        },
        "&:before": {
            content: "''",
            height: 0,
            width: "100%",
            bottom: -30,
            display: "block",
            backgroundColor: colors.ocean,
            position: "absolute",
            transition: "height 200ms ease"
        }
    },
    newActivities: {
        color: colors.black,
        fontSize: 11,
        fontWeight: 600,
        paddingBottom: 20
    }
};

class ActivityList extends Component<
    {
        activities: ActivityCommon[],
        unseenActivityCount: number
    },
    *
> {
    render() {
        const { activities, classes, unseenActivityCount } = this.props;
        return (
            <div className={classes.base}>
                <div className={classes.newActivities}>
                    {unseenActivityCount > 1 &&
                        unseenActivityCount + " NEW ACTIVITIES"}
                    {unseenActivityCount === 1 &&
                        unseenActivityCount + " NEW ACTIVITY"}
                </div>
                {activities.map(activity => {
                    return <Activity data={activity} key={activity.id} />;
                })}
                <div className={classes.buttonWrap}>
                    <span
                        className={classnames(
                            classes.button,
                            classes.clickable
                        )}
                    >
                        CLEAR ALL
                    </span>
                    <span
                        className={classnames(
                            classes.button,
                            classes.clickable
                        )}
                    >
                        MARK AS READ
                    </span>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ActivityList);
