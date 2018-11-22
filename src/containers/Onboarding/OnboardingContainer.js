//@flow
import React, { Component } from "react";
import SpinnerCard from "components/spinners/SpinnerCard";
import HelpLink from "components/HelpLink";
import Logo from "components/Logo";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Welcome from "./Welcome";
import WrappingKeys from "./WrappingKeys";
import Prerequisite from "./Prerequisite";
import PrerequisiteSeed from "./PrerequisiteSeed";
import WrappingKeyPrerequisite from "./WrappingKeyPrerequisite";
import SharedOwnerRegistration from "./SharedOwnerRegistration";
import ConfigurationAdministrators from "./ConfigurationAdministrators";
import ConfigurationWrapping from "./ConfigurationWrapping";
import ConfigurationSeed from "./ConfigurationSeed.js";
import Registration from "./Registration";
import SignIn from "./SignIn";
import SharedOwnerValidation from "./SharedOwnerValidation";
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
  fatal_error: {
    opacity: 0.3,
    pointerEvents: "none"
  },
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
    width: 728,
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

    const url = process.env["NOTIFICATION_URL"] || "/";
    const path = process.env["NOTIFICATION_PATH"] || "/notification/socket.io";
    const socket = io.connect(url, { onboarding: true, path: path });
    let self = this;
    socket.on("connect", function() {
      socket.emit("authenticate", {
        token: "onboarding",
        orga: self.props.match.params.orga_name
      });
    });
    socket.on(self.props.match.params.orga_name + "/onboarding", function() {
      self.onNewOnboardingState();
    });
  }

  onNewOnboardingState = () => {
    setTimeout(() => {
      this.props.onGetState();
    }, Math.floor(Math.random() * 1000));
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
        <div
          className={cx(classes.base, {
            [classes.fatal_error]: onboarding.fatal_error
          })}
        >
          <div className={classes.banner}>
            <Logo />
            <HelpLink className={classes.support}>HELP</HelpLink>
          </div>
          <Menu
            nbMember={onboarding.registering.admins.length}
            nbSharedOwner={onboarding.sharedOwners.length}
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
            {onboarding.state === "WRAPPING_KEY_SIGN_IN" && (
              <WrappingKeys history={history} />
            )}
            {onboarding.state === "ADMINISTRATORS_PREREQUISITE" && (
              <Prerequisite />
            )}
            {onboarding.state === "ADMINISTRATORS_CONFIGURATION" && (
              <ConfigurationAdministrators />
            )}
            {onboarding.state === "ADMINISTRATORS_REGISTRATION" && (
              <Registration history={history} />
            )}
            {onboarding.state === "ADMINISTRATORS_SCHEME_CONFIGURATION" && (
              <AdministrationScheme
                onChange={changeNbRequired}
                total={onboarding.registering.admins.length}
                number={onboarding.quorum}
                is_editable={onboarding.is_editable}
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
            {onboarding.state === "SHARED_OWNER_REGISTRATION" && (
              <SharedOwnerRegistration />
            )}
            {onboarding.state === "SHARED_OWNER_VALIDATION" && (
              <SharedOwnerValidation />
            )}
            {onboarding.state === "MASTER_SEED_GENERATION" && (
              <Provisionning history={history} />
            )}
            {onboarding.state === "COMPLETE" && (
              <ConfirmationGlobal match={match} history={history} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(OnboardingContainer)
);
