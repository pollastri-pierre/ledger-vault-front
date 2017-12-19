//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DialogButton } from "../../components";
import Plug from "../../components/icons/thin/Plug";
import translate from "../../decorators/Translate";

class DeviceLogin extends Component<{
  onCancel: Function,
  team: string
}> {
  context: {
    translate: (string, ?Object) => string
  };
  render() {
    const { team, onCancel } = this.props;
    const t = this.context.translate;
    return (
      <div className="DeviceLogin">
        <Plug className="dongle" color="#e2e2e2" />
        <br />
        <div className="team">{t("login.signIn", { team })}</div>
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
        <div className="wait">{t("login.awaitingDevice")}</div>
      </div>
    );
  }
}

DeviceLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default translate(DeviceLogin);
