//@flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import type { Translate } from "data/types";
import { DialogButton } from "components";
import { withStyles } from "@material-ui/core/styles";
import Profile from "components/icons/thin/Profile";
import MUITextField from "@material-ui/core/TextField";

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
  classes: { [_: $Keys<typeof styles>]: string },
  onChange: Function,
  t: Translate,
  onStartAuth: Function,
  onCloseTeamError: Function,
  isChecking: boolean,
  domain: string,
  error: ?Error
}> {
  context: {
    translate: string => string
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    if (this.props.domain !== "" && !this.props.isChecking) {
      this.props.onStartAuth();
    }
  };

  handleRequestClose = () => {
    this.props.onCloseTeamError();
  };

  onChange = (e: any) => {
    this.props.onChange(e.currentTarget.value);
  };

  render() {
    const { domain, classes, error, isChecking, t } = this.props;
    return (
      <form onSubmit={this.onSubmit} className={classes.base}>
        <Profile className={classes.icon} color="#e2e2e2" />
        <br />
        <MUITextField
          error={error ? domain !== "" : false}
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
          disabled={isChecking}
          value={domain}
          id="textField"
          name="email"
          onChange={this.onChange}
          placeholder={t("login.hint")}
        />
        <br />
        <div className={classes.instructions}>{t("login.instructions")}</div>
        <DialogButton
          className={classes.submit}
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

export default withStyles(styles)(translate()(TeamLogin));
