//@flow
import React, { Component } from "react";
import { translate } from "react-i18next";
import { Alert } from "components";
import LandingLinks from "containers/LandingLinks";
import network from "network";
import type { Translate } from "data/types";
import HelpLink from "components/HelpLink";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import { DialogButton } from "components";
import Logo from "components/Logo";

import Profile from "components/icons/thin/Profile";
import MUITextField from "@material-ui/core/TextField";

const styles = {
  base: {
    position: "relative",
    textAlign: "center",
    height: 258,
    width: 400,
    backgroundColor: "#ffffff",
    boxShadow: "0px 2.5px 2.5px 0 rgba(0, 0, 0, 0.04)"
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column"
  },
  banner: {
    width: "400px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20
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
  help: {
    width: 63,
    textDecoration: "none",
    cursor: "pointer",
    marginRight: "0",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: "0.5",
    transition: "opacity 0.2s ease",
    verticalAlign: "super",
    lineHeight: "1em",
    top: "5px",
    right: "0",
    "&:visited": {
      color: "inherit"
    }
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
class Welcome extends Component<
  {
    classes: { [_: $Keys<typeof styles>]: string },
    history: *,
    t: Translate
  },
  { domain: string, error: boolean, isChecking: boolean }
> {
  state = {
    domain: "",
    error: false,
    isChecking: false
  };

  onSubmit = async (e: *) => {
    e.preventDefault();
    e.stopPropagation();
    const { domain, isChecking } = this.state;
    const { history } = this.props;

    if (domain !== "" && !isChecking) {
      this.setState({ isChecking: true });
      try {
        await network(`/gate/${domain}/organization/exists`, "GET");
        this.setState({ isChecking: false });
        history.push(`/${domain}`);
      } catch (e) {
        console.error(e);
        this.setState({ error: true, isChecking: false });
      }
    }
  };

  onChange = (e: any) => {
    this.setState({ domain: e.currentTarget.value });
  };

  onClose = () => {
    this.setState({ error: false });
  };

  render() {
    const { domain, error, isChecking } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.wrapper}>
        <Alert
          onClose={this.onClose}
          open={error}
          autoHideDuration={4000}
          title="Error"
          theme="error"
        >
          <div>Unknown organization domain name</div>
        </Alert>
        <div className={classes.banner}>
          <Logo />
          <HelpLink
            className={classes.help}
            subLink="/Content/operations/login"
          >
            Support
          </HelpLink>
        </div>
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
            placeholder={t("welcome:placeholder_domain")}
          />
          <br />
          <div className={classes.instructions}>
            {t("welcome:domain_description")}
          </div>
          <DialogButton
            className={classes.submit}
            highlight
            disabled={!domain || isChecking}
            right
            onTouchTap={this.onSubmit}
          >
            {t("common:continue")}
          </DialogButton>
        </form>
        <LandingLinks />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(translate()(Welcome)));
