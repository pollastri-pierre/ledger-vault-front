// @flow
import React, { Component, Fragment } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Trans } from "react-i18next";
import Copy from "components/icons/Copy";
import colors from "shared/colors";

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  textToCopy: string
};

type State = {
  copied: boolean
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:hover $buttonCopy": {
      display: "flex",
      backgroundColor: colors.cream
    }
  },
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  buttonCopy: {
    display: "none",
    position: "fixed",
    alignSelf: "flex-end",
    color: colors.ocean,
    fontSize: "11px"
  },
  copyIcon: {
    marginRight: "3px"
  }
};

class CopyToClipboardButton extends Component<Props, State> {
  state = {
    copied: false
  };

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  _timeout: ?TimeoutID = null;

  render() {
    const { classes, textToCopy } = this.props;
    const { copied } = this.state;
    return (
      <div className={classes.container}>
        <span className={classes.text}>{textToCopy}</span>
        <CopyToClipboard text={textToCopy} onCopy={this.onCopy}>
          <Button
            className={classes.buttonCopy}
            variant="contained"
            size="small"
          >
            {copied ? (
              <span>
                <Trans i18nKey="operationDetails:overview.copied" />
              </span>
            ) : (
              <Fragment>
                <div className={classes.copyIcon}>
                  <Copy color={colors.ocean} size={12} />
                </div>
                <span>
                  <Trans i18nKey="operationDetails:overview.copy" />
                </span>
              </Fragment>
            )}
          </Button>
        </CopyToClipboard>
      </div>
    );
  }
}

export default withStyles(styles)(CopyToClipboardButton);
