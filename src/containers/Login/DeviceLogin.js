//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DialogButton } from "../../components";
import Plug from "../../components/icons/thin/Plug";
import translate from "../../decorators/Translate";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    position: "relative",
    textAlign: "center",
    display: "inline-block",
    height: "395px",
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
    textTransform: "uppercase",
    position: "absolute",
    bottom: 40,
    right: 40
  },
  cancel: {
    position: "absolute",
    bottom: 0,
    left: 40
  }
};
class DeviceLogin extends Component<{
  onCancel: Function,
  team: string
}> {
  context: {
    translate: (string, ?Object) => string
  };
  render() {
    const { team, onCancel, classes } = this.props;
    const t = this.context.translate;
    return (
      <div className={classes.base}>
        <Plug className={classes.dongle} color="#e2e2e2" />
        <br />
        <div className={classes.team}>{t("login.signIn", { team })}</div>
        <div className={classes.spacer} />
        <div className={classes.instructions}>
          <div className={classes.item}>
            <div className="bullet">1.</div>
            <div className="step">{t("login.stepOne")}</div>
          </div>
          <div className={classes.item}>
            <div className="bullet">2.</div>
            <div className="step">{t("login.stepTwo")}</div>
          </div>
          <div className={classes.item}>
            <div className="bullet">3.</div>
            <div className="step">{t("login.stepThree")}</div>
          </div>
        </div>
        <DialogButton onTouchTap={onCancel} className={classes.cancel}>
          {t("common.cancel")}
        </DialogButton>
        <div className={classes.wait}>{t("login.awaitingDevice")}</div>
      </div>
    );
  }
}

DeviceLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default translate(withStyles(styles)(DeviceLogin));
