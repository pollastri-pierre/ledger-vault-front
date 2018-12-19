//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  header: React$Node,
  content: React$Node,
  footer: React$Node,
  classes: { [_: $Keys<typeof styles>]: string }
};

class SendLayout extends PureComponent<Props, *> {
  render() {
    const { header, content, footer, classes } = this.props;

    return (
      <div className={classes.root}>
        {header && <div>{header}</div>}
        {content && <div className={classes.content}>{content}</div>}
        {footer && <div className={classes.footer}>{footer}</div>}
      </div>
    );
  }
}
const styles = {
  footer: {
    margin: "auto 0 0 20px"
  },
  content: {
    height: '100vh'
  },
  root: {
    padding: "0 40px",
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
};
export default withStyles(styles)(SendLayout);
