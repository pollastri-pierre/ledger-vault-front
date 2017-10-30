import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, DialogButton } from "../../components";
import Profile from "../../components/icons/thin/Profile";

export class TeamLogin extends Component {
  constructor(props) {
    super(props);

    this.selectTeam = this.selectTeam.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keypress", this.confirm);
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.confirm);
  }

  selectTeam() {
    if (this.props.team !== "" && !this.props.isChecking) {
      this.props.onStartAuth();
    }
  }

  confirm(e) {
    if (e.charCode === 13) {
      this.selectTeam();
    }
  }

  handleRequestClose = () => {
    this.props.onCloseTeamError();
  };

  render() {
    const t = this.context.translate;
    return (
      <div className="TeamLogin">
        <Profile className="user" color="#e2e2e2" />
        <br />
        <TextField
          onKeyDown={this.confirm}
          hasError={this.props.teamError && this.props.team !== ""}
          style={{ width: "320px" }}
          disabled={this.props.isChecking}
          inputStyle={{ textAlign: "center" }}
          value={this.props.team}
          id="textField"
          errorText=""
          onChange={this.props.onChange}
          hintStyle={{ textAlign: "center", width: "100%" }}
          hintText={t("login.hint")}
        />
        <br />
        <div className="instructions">{t("login.instructions")}</div>
        <DialogButton
          highlight
          disabled={this.props.team === ""}
          right
          onTouchTap={this.selectTeam}
        >
          {t("common.continue")}
        </DialogButton>
      </div>
    );
  }
}

TeamLogin.propTypes = {
  onChange: PropTypes.func.isRequired,
  onStartAuth: PropTypes.func.isRequired,
  onCloseTeamError: PropTypes.func.isRequired,
  isChecking: PropTypes.bool.isRequired,
  team: PropTypes.string.isRequired,
  teamError: PropTypes.bool.isRequired
};

TeamLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default TeamLogin;
