//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";
import classnames from "classnames";

import type { ActivityCommon } from "data/types";
import colors, { hexToRgbA } from "shared/colors";

import ActivityFactory from "../ActivityFactory";
import DateFormat from "../DateFormat";

const styles = {
    bold: {
        fontWeight: 600
    }
};

class Bold extends Component<
    {
        classes: { [_: $Keys<typeof styles>]: string }
    },
    *
> {
    render() {
        const { children, classes } = this.props;
        return <span className={classes.bold}>{children}</span>;
    }
}

export default withStyles(styles)(Bold);
