//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import queryString from "query-string";
import TeamLogin from "./TeamLogin";
import DeviceLogin from "./DeviceLogin";
import { withStyles } from "material-ui/styles";
import {
  setTeamField,
  logout,
  startAuthentication,
  reinitTeamError,
  resetTeam
} from "redux/modules/auth";

import logoBlack from "assets/img/logo-black.png";
import logoBlack2x from "assets/img/logo-black@2x.png";
import logoBlack3x from "assets/img/logo-black@3x.png";

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  onFieldTeam: (e, val) => dispatch(setTeamField(val)),
  onLogout: () => dispatch(logout()),
  onStartAuth: () => dispatch(startAuthentication()),
  onCloseTeamError: () => dispatch(reinitTeamError()),
  onResetTeam: () => dispatch(resetTeam())
});

type Props = {
  auth: {
    team: string,
    isCheckingTeam: boolean,
    teamError: boolean,
    teamValidated: boolean
  },
  history: Object,
  location: Object,
  onFieldTeam: (e: *, val: *) => void,
  onLogout: () => void,
  onStartAuth: () => void,
  onCloseTeamError: () => void,
  onResetTeam: () => void,
  classes: Object
};

const styles = {
  base: {
    display: "table",
    width: "100vw",
    height: "100vh"
  },
  wrapper: {
    display: "table-cell",
    textAlign: "center",
    verticalAlign: "middle"
  },
  banner: {
    width: "400px",
    margin: "auto",
    marginBottom: "20px",
    position: "relative",
    textAlign: "left"
  },
  help: {
    width: 63,
    cursor: "pointer",
    marginRight: "0",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: "0.5",
    transition: "opacity 0.2s ease",
    verticalAlign: "super",
    lineHeight: "1em",
    position: "absolute",
    top: "5px",
    right: "0;"
  }
};

class Login extends Component<Props> {
  context: {
    translate: string => string
  };
  componentWillMount() {
    const { auth, history, location } = this.props;
    if (auth.isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.replace(redirectTo || "/");
    }
  }

  componentWillUpdate(nextProps: Props) {
    const { history, location } = nextProps;
    if (nextProps.auth.isAuthenticated) {
      const { redirectTo } = queryString.parse(
        (location.search || "").slice(1)
      );
      history.push(redirectTo || "/");
    }
  }

  render() {
    const t = this.context.translate;
    let content = null;
    const { team, isCheckingTeam, teamError, teamValidated } = this.props.auth;
    const { classes } = this.props;

    if (teamValidated) {
      content = <DeviceLogin team={team} onCancel={this.props.onResetTeam} />;
    } else {
      content = (
        <TeamLogin
          team={team}
          teamError={teamError}
          isChecking={isCheckingTeam}
          onChange={this.props.onFieldTeam}
          onLogout={this.props.onLogout}
          onStartAuth={this.props.onStartAuth}
          onCloseTeamError={this.props.onCloseTeamError}
        />
      );
    }
    return (
      <div className={classes.base}>
        <div className={classes.wrapper}>
          <div className={classes.banner}>
            <img
              src={logoBlack}
              srcSet={`${logoBlack2x} 2x, ${logoBlack3x} 3x`}
              alt="Ledger Vault"
            />
            <div className={classes.help}>{t("login.help")}</div>
          </div>
          {content}
        </div>
      </div>
    );
  }
}

Login.contextTypes = {
  translate: PropTypes.func.isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(Login);
