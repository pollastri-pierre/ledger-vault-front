// @flow
import React, { Component } from "react";
import DialogButton from "components/buttons/DialogButton";
import type { Translate } from "data/types";
import Plug from "components/icons/thin/Plug";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    position: "relative",
    textAlign: "center",
    display: "inline-block",
    margin: "0 auto",
    marginBottom: "50px",
    width: "400px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 2.5px 2.5px 0 rgba(0, 0, 0, 0.04)"
  },
  dongle: {
    width: 32,
    height: 20,
    marginTop: 40,
    marginBottom: 10
  },
  team: {
    width: 320,
    textSlign: "center",
    display: "inline-block",
    fontSize: 16
  },
  spacer: {
    width: 320,
    height: 1,
    backgroundColor: "#eeeeee",
    display: "inline-block",
    textAlign: "center",
    marginTop: 6
  },
  instructions: {
    textAlign: "left",
    fontSize: 13,
    paddingTop: 24
  },
  item: {
    "&:not(:first-child)": {
      marginTop: 20
    },
    "& div:nth-child(1)": {
      float: "left",
      fontSize: 18,
      marginLeft: 45
    },
    "& div:nth-child(2)": {
      marginLeft: 77,
      marginRight: 58,
      fontSize: 13,
      lineHeight: 1.54
    }
  },
  wait: {
    color: "#cccccc",
    textAlign: "right",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase"
  },
  footer: {
    padding: "40px 40px 0",
    display: "flex",
    justifyContent: "space-between"
  }
};
class DeviceLogin extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  onCancel: Function,
  domain: string,
  t: Translate,
  isChecking: boolean,
  onRestart: () => void
}> {
  render() {
    const { domain, classes, isChecking, onCancel, onRestart, t } = this.props;
    return (
      <div className={classes.base}>
        <Plug className={classes.dongle} color="#e2e2e2" />
        <br />
        <div className={classes.team}>{t("login:signIn", { domain })}</div>
        <div className={classes.spacer} />
        <div className={classes.instructions}>
          <div className={classes.item}>
            <div>1.</div>
            <div>{t("login:step1")}</div>
          </div>
          <div className={classes.item}>
            <div>2.</div>
            <div>{t("login:step2")}</div>
          </div>
          <div className={classes.item}>
            <div>3.</div>
            <div>{t("login:step3")}</div>
          </div>
        </div>
        <div className={classes.footer}>
          <DialogButton onTouchTap={onCancel}>
            {t("common:cancel")}
          </DialogButton>
          {!isChecking ? (
            <DialogButton onTouchTap={onRestart}>TRY AGAIN</DialogButton>
          ) : (
            <div className={classes.wait}>{t("common:awaiting_device")}</div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(translate()(DeviceLogin));
