// @flow
import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { urls } from "utils/urls";

const styles = {
  link: {
    textDecoration: "none",
    color: "inherit",
  },
};
type Props = {
  label: React$Node,
  className: string,
  classes: { [_: $Keys<typeof styles>]: string },
};
class SupportLink extends PureComponent<Props> {
  render() {
    const { label, classes, className } = this.props;
    return (
      <>
        <a
          href={urls.customer_support}
          target="new"
          className={cx(classes.link, className)}
        >
          {label}
        </a>
      </>
    );
  }
}

export default withStyles(styles)(SupportLink);
