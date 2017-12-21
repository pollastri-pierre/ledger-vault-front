//@flow
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import classNames from "classnames";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";

const styles = {
  root: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40
  }
};

class MenuLink extends Component<{
  color?: string,
  to: string,
  exact?: boolean,
  strict?: boolean,
  classes: Object,
  className?: string,
  children: *
}> {
  render() {
    const {
      classes,
      to,
      exact,
      strict,
      color,
      children,
      className,
      ...props
    } = this.props;
    return (
      <Route path={to} exact={exact} strict={strict}>
        {({ match }) => (
          <MenuItem
            style={{
              color: color || "#27d0e2" //default FIXME from theme
            }}
            className={classNames(classes.root, className)}
            button
            disableRipple
            selected={!!match}
            component={Link}
            to={to}
            {...props}
          >
            {children}
          </MenuItem>
        )}
      </Route>
    );
  }
}

export default withStyles(styles)(MenuLink);
