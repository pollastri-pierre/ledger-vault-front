//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DialogButton } from "../../components";
import Plug from "../../components/icons/thin/Plug";
import translate from "../../decorators/Translate";

class DeviceLogin extends Component<{
  onCancel: Function,
  domain: string,
  isChecking: boolean,
  onRestart: () => void
}> {
  context: {
    translate: (string, ?Object) => string
  };
  render() {
    const { domain, isChecking, onCancel, onRestart } = this.props;
    const t = this.context.translate;
    return (
      <div className="DeviceLogin">
        <Plug className="dongle" color="#e2e2e2" />
        <br />
        <div className="team">{t("login.signIn", { domain })}</div>
        <div className="spacer" />
        <div className="instructions">
          <div className="item">
            <div className="bullet">1.</div>
            <div className="step">{t("login.stepOne")}</div>
          </div>
          <div className="item">
            <div className="bullet">2.</div>
            <div className="step">{t("login.stepTwo")}</div>
          </div>
          <div className="item">
            <div className="bullet">3.</div>
            <div className="step">{t("login.stepThree")}</div>
          </div>
        </div>
        <DialogButton onTouchTap={onCancel}>{t("common.cancel")}</DialogButton>
        {!isChecking ? (
          <DialogButton
            style={{
              float: "none",
              left: "auto",
              right: 0,
              marginRight: 40 /* THIS IS A HACK, the markup probably should be rewrite because float/br should really be avoided */
            }}
            onTouchTap={onRestart}
          >
            TRY AGAIN
          </DialogButton>
        ) : (
          <div className="wait">{t("login.awaitingDevice")}</div>
        )}
      </div>
    );
  }
}

DeviceLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default translate(DeviceLogin);
