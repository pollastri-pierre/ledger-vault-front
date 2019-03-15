// @flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  header: React$Node,
  content: React$Node,
  footer: React$Node,
  classes: { [_: $Keys<typeof styles>]: string },
};

class ReceiveLayout extends PureComponent<Props, *> {
  render() {
    const { header, content, footer, classes } = this.props;

    return (
      <Fragment>
        {header && <div>{header}</div>}
        {content && <div>{content}</div>}
        {footer && <div className={classes.footer}>{footer}</div>}
      </Fragment>
    );
  }
}
const styles = {
  footer: {
    margin: "20px 0px",
  },
};
export default withStyles(styles)(ReceiveLayout);
