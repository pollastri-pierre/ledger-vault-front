// @flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

type Props = { className: string, classes: Object };

const styles = {
  common: {
    width: 13
  }
};

class ArrowDown extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;

    return (
      <svg
        viewBox="0 0 30 18.25"
        className={classnames(classes.common, className)}
      >
        <polygon points="0 3.25 3.26 0 15 11.75 26.75 0 30 3.25 15 18.25 0 3.25" />
      </svg>
    );
  }
}

export default withStyles(styles)(ArrowDown);
