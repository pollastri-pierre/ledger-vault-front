// @flow
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import classNames from "classnames";
import MenuItem from "@material-ui/core/MenuItem";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    fontSize: 11,
    fontWeight: 600,
    paddingLeft: 40
  },
  disabled: {
    opacity: 0.2
  }
};

class MenuLink extends Component<{
  color?: string,
  to: string,
  exact?: boolean,
  strict?: boolean,
  disabled?: boolean,
  classes: Object,
  className?: string,
  children: *,
  overrides?: Object
}> {
  render() {
    const {
      classes,
      to,
      exact,
      strict,
      color,
      children,
      overrides,
      disabled,
      className,
      ...props
    } = this.props;
    return (
      <Route path={to} exact={exact} strict={strict}>
        {({ match }) => (
          <MenuItem
            style={{
              color: color || "#27d0e2" // default FIXME from theme
            }}
            className={classNames(classes.root, className, {
              [classes.disabled]: disabled
            })}
            button
            disabled={disabled}
            disableRipple
            selected={!!match}
            component={Link}
            to={to}
            classes={overrides}
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
