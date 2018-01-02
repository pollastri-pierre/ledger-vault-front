//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { DialogButton } from "../../components";
import { withStyles } from "material-ui/styles";
import Profile from "../../components/icons/thin/Profile";
import MUITextField from "material-ui/TextField";

const styles = {
  base: {
    position: "relative",
    textAlign: "center",
    display: "inline-block",
    marginBottom: "150px",
    height: "258px",
    margin: "0 auto",
    width: "400px",
    backgroundColor: "#ffffff",
    boxShadow: "0px 2.5px 2.5px 0 rgba(0, 0, 0, 0.04)"
  },
  instructions: {
    fontSize: "13px",
    paddingTop: "22px"
  },
  icon: {
    marginTop: 40,
    width: 28,
    height: 32
  },
  submit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: 40
  },
  input: {
    textAlign: "center"
  }
};
export class TeamLogin extends Component<{
  onChange: Function,
  onStartAuth: Function,
  onCloseTeamError: Function,
  isChecking: boolean,
  team: string,
  teamError: boolean
}> {
  context: {
    translate: string => string
  };
  componentDidMount() {
    // FIXME a better way is to use a wrapping <form>, hook on onSubmit so we can catch the ENTER or any submitting other ways
    document.addEventListener("keypress", this.confirm);
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.confirm);
  }

  selectTeam = () => {
    if (this.props.team !== "" && !this.props.isChecking) {
      this.props.onStartAuth();
    }
  };

  confirm = (e: *) => {
    if (e.charCode === 13) {
      this.selectTeam();
    }
  };

  handleRequestClose = () => {
    this.props.onCloseTeamError();
  };

  render() {
    const t = this.context.translate;
    const { classes } = this.props;
    return (
      <div className={classes.base}>
        <Profile className={classes.icon} color="#e2e2e2" />
        <br />
        <MUITextField
          onKeyDown={this.confirm}
          error={this.props.teamError && this.props.team !== ""}
          style={{ width: "320px", marginTop: "5px" }}
          InputProps={{
            inputProps: {
              style: {
                fontSize: "13px",
                paddingBottom: "15px",
                textAlign: "center"
              }
            }
          }}
          disabled={this.props.isChecking}
          value={this.props.team}
          id="textField"
          onChange={this.props.onChange}
          placeholder={t("login.hint")}
        />
        <br />
        <div className={classes.instructions}>{t("login.instructions")}</div>
        <DialogButton
          className={classes.submit}
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

TeamLogin.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default withStyles(styles)(TeamLogin);
