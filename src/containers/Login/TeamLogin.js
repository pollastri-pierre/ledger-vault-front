//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, DialogButton } from "../../components";
import Profile from "../../components/icons/thin/Profile";

export class TeamLogin extends Component<{
  onChange: Function,
  onStartAuth: Function,
  onCloseTeamError: Function,
  isChecking: boolean,
  domain: string,
  error: ?Error
}> {
  context: {
    translate: string => string
  };

  onSubmit = (e: *) => {
    e.preventDefault();
    if (this.props.domain !== "" && !this.props.isChecking) {
      this.props.onStartAuth();
    }
  };

  handleRequestClose = () => {
    this.props.onCloseTeamError();
  };

  onChange = (e: SyntheticEvent<*>) => {
    this.props.onChange(e.currentTarget.value);
  };

  render() {
    const { domain, error, isChecking } = this.props;
    const t = this.context.translate;
    return (
      <form onSubmit={this.onSubmit} className="TeamLogin">
        <Profile className="user" color="#e2e2e2" />
        <br />
        <TextField
          error={error ? domain !== "" : false}
          style={{ width: "320px" }}
          inputProps={{ style: { textAlign: "center" } }}
          disabled={isChecking}
          value={domain}
          id="textField"
          name="email"
          onChange={this.onChange}
          placeholder={t("login.hint")}
        />
        <br />
        <div className="instructions">{t("login.instructions")}</div>
        <DialogButton
          highlight
          disabled={!domain || isChecking}
          right
          onTouchTap={this.onSubmit}
        >
          {t("common.continue")}
        </DialogButton>
      </form>
    );
  }
}

TeamLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default TeamLogin;
