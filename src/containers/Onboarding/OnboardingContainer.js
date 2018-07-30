//@flow
import React, { Component } from "react";
import SpinnerCard from "components/spinners/SpinnerCard";
import Logo from "components/Logo";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Welcome from "./Welcome";
import Authentication from "./Authentication";
import Prerequisite from "./Prerequisite";
import PrerequisiteSeed from "./PrerequisiteSeed";
import WrappingKeyPrerequisite from "./WrappingKeyPrerequisite";
import ConfigurationAdministrators from "./ConfigurationAdministrators";
import ConfigurationWrapping from "./ConfigurationWrapping";
import ConfigurationSeed from "./ConfigurationSeed.js";
import Registration from "./Registration";
import SignIn from "./SignIn";
import Backup from "./Backup.js";
import Provisionning from "./Provisioning.js";
import ConfirmationGlobal from "./ConfirmationGlobal.js";
import AdministrationScheme from "./AdministrationScheme.js";
import Menu from "./Menu";
import { connect } from "react-redux";
import { getState, changeQuorum } from "redux/modules/onboarding";
import io from "socket.io-client";

const mapStateToProps = state => ({
  onboarding: state.onboarding
});

const mapDispatchToProps = (dispatch: *) => ({
  onGetState: () => dispatch(getState()),
  changeNbRequired: nb => dispatch(changeQuorum(nb))
});

const styles = {
  wrapper: {
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  banner: {
    position: "absolute",
    top: -52,
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  support: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    textDecoration: "none",
    color: "#767676"
  },
  base: {
    background: "white",
    width: 685,
    padding: "40px 40px 40px 0",
    boxShadow: "0 2.5px 2.5px 0 rgba(0,0,0,.04)",
    display: "flex",
    position: "relative"
  },
  content: {
    position: "relative",
    flex: 1
  },
  link: {
    "& > span": {
      textTransform: "uppercase",
      color: "grey"
    }
  },
  selected: {
    color: "red",
    "& > span": {
      color: "black!important"
    }
  },
  labelLinkMarginTop: {
    marginTop: 20
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  match: *,
  history: *,
  onboarding: *,
  changeNbRequired: Function,
  onGetCurrentState: Function,
  onGetState: Function
};

type State = {
  nbAdministrator: number,
  nbRequired: number
};

class OnboardingContainer extends Component<Props, State> {
  componentDidMount() {
    this.props.onGetState();

    const url =
      process.env.NODE_ENV !== "development"
        ? "/notification"
        : "http://localhost:3033";
    const socket = io.connect(
      url,
      { onboarding: true }
    );
    let self = this;
    socket.on("connect", function() {
      socket.emit("authenticate", {
        token: "onboarding",
        orga: self.props.match.params.orga_name
      });
    });
    socket.on(self.props.match.params.orga_name + "/onboarding", function(
      onboardingState
    ) {
      self.onNewOnboardingState(onboardingState);
    });
  }

  onNewOnboardingState = onboardingState => {
    console.log(onboardingState);
    this.props.onGetState();
  };

  render() {
    const {
      classes,
      onboarding,
      changeNbRequired,
      match,
      history
    } = this.props;

    if (!onboarding.state) {
      return <SpinnerCard />;
    }
    return (
      <div className={cx("App", classes.wrapper)}>
        <div className={classes.base}>
          <div className={classes.banner}>
            <Logo />
            <a href="http://help.vault.ledger.com" className={classes.support}>
              HELP
            </a>
          </div>
          <Menu
            nbMember={onboarding.registering.admins.length}
            onboarding={onboarding}
          />
          <div className={classes.content}>
            {onboarding.state === "LOADING" && <SpinnerCard />}
            {onboarding.state === "EMPTY_PARTITION" && <Welcome />}
            {onboarding.state === "WRAPPING_KEY_PREREQUISITES" && (
              <WrappingKeyPrerequisite />
            )}
            {onboarding.state === "WRAPPING_KEY_CONFIGURATION" && (
              <ConfigurationWrapping />
            )}
            {onboarding.state === "WRAPPING_KEY_BACKUP" && <Backup />}
            {onboarding.state === "WRAPPING_KEY_SIGN_IN" && <Authentication />}
            {onboarding.state === "ADMINISTRATORS_PREREQUISITE" && (
              <Prerequisite />
            )}
            {onboarding.state === "ADMINISTRATORS_CONFIGURATION" && (
              <ConfigurationAdministrators />
            )}
            {onboarding.state === "ADMINISTRATORS_REGISTRATION" && (
              <Registration />
            )}
            {onboarding.state === "ADMINISTRATORS_SCHEME_CONFIGURATION" && (
              <AdministrationScheme
                onChange={changeNbRequired}
                total={onboarding.registering.admins.length}
                number={onboarding.quorum}
              />
            )}
            {onboarding.state === "ADMINISTRATORS_SIGN_IN" && <SignIn />}
            {onboarding.state === "MASTER_SEED_PREREQUISITE" && (
              <PrerequisiteSeed />
            )}
            {onboarding.state === "MASTER_SEED_CONFIGURATION" && (
              <ConfigurationSeed />
            )}
            {onboarding.state === "MASTER_SEED_BACKUP" && <Backup />}
            {onboarding.state === "MASTER_SEED_GENERATION" && <Provisionning />}
            {onboarding.state === "COMPLETE" && (
              <ConfirmationGlobal match={match} history={history} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OnboardingContainer));
