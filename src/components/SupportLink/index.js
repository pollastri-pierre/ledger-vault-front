//@flow
import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  link: {
    textDecoration: "none"
  }
};
type Props = {
  label: string,
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};
class SupportLink extends PureComponent<Props> {
  render() {
    const { label, classes, className } = this.props;
    return (
      <div>
        <a
          href="https://help.vault.ledger.com"
          target="new"
          className={cx(classes.link, className)}
        >
          {label}
        </a>
      </div>
    );
  }
}

export default withStyles(styles)(SupportLink);
