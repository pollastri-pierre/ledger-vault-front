//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";
import classnames from "classnames";

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
