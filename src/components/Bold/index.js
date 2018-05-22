//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

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
        const { classes } = this.props;
        return <span className={classes.bold}>{children}</span>;
    }
}

export default withStyles(styles)(Bold);
