//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityCommon } from "data/types";
import colors, { hexToRgbA } from "shared/colors";

import ActivityFactory from "../ActivityFactory";
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

const dayDateFormat = {
    sameDay: "[TODAY]",
    lastDay: "[YESTERDAY]",
    lastWeek: "ddd D MMM",
    sameElse: "ddd D MMM"
};

const hourDateFormat = {
    sameDay: "LT",
    lastDay: "LT",
    lastWeek: "LT",
    sameElse: "LT"
};

class Activity extends Component<
    {
        data: ActivityCommon,
        classes: { [_: $Keys<typeof styles>]: string }
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
        const { data, classes } = this.props;

        return (
            <div className={classnames(classes.clickable, classes.activity)}>
                <div className={classes.bulletWrap}>
                    {!data.seen && <div className={classes.bullet} />}
                </div>
                <div
                    className={classnames(
                        classes.dateWrap,
                        this.getSeenClass(data.seen)
                    )}
                >
                    <div
                        className={classnames(classes.uppercase, classes.date)}
                    >
                        <DateFormat
                            date={data.created_on}
                            format={dayDateFormat}
                        />
                    </div>
                    <div
                        className={classnames(classes.uppercase, classes.date)}
                    >
                        <DateFormat
                            date={data.created_on}
                            format={hourDateFormat}
                        />
                    </div>
                </div>
                <span
                    className={classnames(
                        classes.activityMessage,
                        this.getSeenClass(data.seen)
                    )}
                >
                    {ActivityFactory.build(data.business_action)}
                </span>
            </div>
        );
    }
}

export default withStyles(styles)(Activity);
