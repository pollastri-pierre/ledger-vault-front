//@flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  content: React$Node,
  footer: React$Node,
  paddedHorizontal?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
};

class SendLayout extends PureComponent<Props, *> {
  render() {
    const { content, footer, classes, paddedHorizontal } = this.props;

    return (
      <Fragment>
        {content && (
          <div
            className={`${classes.content}${
              paddedHorizontal ? ` ${classes.paddedHorizontal}` : ""
            }`}
          >
            {content}
          </div>
        )}
        {footer && <div className={classes.footer}>{footer}</div>}
      </Fragment>
    );
  }
}
const styles = {
  footer: {
    marginTop: 40,
    padding: "0 40px"
  },
  content: {
    flexGrow: 1,
    overflowY: "auto"
  },
  paddedHorizontal: {
    padding: "0 40px"
  }
};
export default withStyles(styles)(SendLayout);
