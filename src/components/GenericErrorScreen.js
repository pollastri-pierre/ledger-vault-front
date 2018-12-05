//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SupportLink from "components/SupportLink";
import colors from "shared/colors";
import { Trans } from "react-i18next";
import ExclamationCircle from "components/icons/ExclamationCircle";

const styles = {
  base: {
    margin: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh"
  },
  errorIcon: {
    justifyContent: "center",
    marginRight: 5,
    display: "flex",
    alignSelf: "center"
  },
  errorTitle: {
    color: colors.grenade
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row"
  },
  messageContainer: {
    margin: "20px 10px",
    backgroundColor: colors.cream
  },
  errorMessage: {
    fontSize: 13,
    padding: 10
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    alignSelf: "flex-end"
  },
  contactSupport: {
    color: colors.steel,
    fontSize: 13,
    backgroundColor: colors.cream,
    "&:hover": {
      backgroundColor: colors.pearl,
      color: colors.ocean
    }
  }
};

class GenericErrorScreen extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  errorMessage: ?string,
  className: ?string,
  customFooter: ?React$Node,
  standardFooter: ?boolean
}> {
  render() {
    const {
      classes,
      errorMessage,
      className,
      standardFooter,
      customFooter
    } = this.props;
    return (
      <div className={classes.base}>
        <div className={classes.titleContainer}>
          <div className={classes.errorIcon}>
            <ExclamationCircle size={16} color={colors.grenade} />
          </div>
          <span className={classes.errorTitle}>
            <Trans i18nKey="common:oops_error" />
          </span>
        </div>
        {errorMessage && (
          <div className={classes.messageContainer}>
            <p className={classes.errorMessage}>{errorMessage}</p>
          </div>
        )}
        {standardFooter && (
          <div className={classes.footer}>
            <Button
              variant="contained"
              className={classes.contactSupport}
              size="small"
            >
              <SupportLink
                label={
                  <span>
                    <Trans i18nKey="receive:support" />
                  </span>
                }
              />
            </Button>
          </div>
        )}
        {customFooter && <div className={className}>{customFooter}</div>}
      </div>
    );
  }
}

export default withStyles(styles)(GenericErrorScreen);
