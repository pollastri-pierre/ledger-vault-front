//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";

import { Link } from "react-router-dom";

const styles = {
    main: {
        textDecoration: "none",
        "&:focus, &:hover, &:visited, &:link, &:active": {
            textDecoration: "none",
            color: "inherit"
        }
    }
};

class NoStyleLink extends Component<
    {
        classes: { [_: $Keys<typeof styles>]: string },
        to: string
    },
    *
> {
    render() {
        const { classes, to, children } = this.props;
        return (
            <Link to={to} className={classes.main}>
                {children}
            </Link>
        );
    }
}

export default withStyles(styles)(NoStyleLink);
