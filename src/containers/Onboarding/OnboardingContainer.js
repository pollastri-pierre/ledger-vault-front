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
import ConfigurationSeed from "./ConfigurationSeed.js";
import Registration from "./Registration";
import SignIn from "./SignIn";
import Backup from "./Backup.js";
import Provisionning from "./Provisioning.js";
import ConfirmationGlobal from "./ConfirmationGlobal.js";
import AdministrationScheme from "./AdministrationScheme.js";
import Menu from "./Menu";
import { connect } from "react-redux";
import { isViewSelected } from "redux/modules/onboarding";
import { getState, changeQuorum } from "redux/modules/onboarding";

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
    height: 547,
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
  }
  render() {
    const { classes, onboarding, changeNbRequired } = this.props;

    if (!onboarding.state) {
      return <SpinnerCard />;
    }
    return (
      <div className={cx("App", classes.wrapper)}>
        <div className={classes.base}>
          <div className={classes.banner}>
            <Logo />
            <a href="#" className={classes.support}>
              support
            </a>
          </div>
          <Menu
            nbMember={onboarding.registering.admins.length}
            onboarding={onboarding}
          />
          <div className={classes.content}>
            {onboarding.state === "EMPTY_PARTITION" && <Welcome />}
            {onboarding.state === "WRAPPING_KEY_PREREQUISITES" && (
              <WrappingKeyPrerequisite />
            )}
            {onboarding.state === "WRAPPING_KEY_CONFIGURATION" && (
              <ConfigurationAdministrators />
            )}
            {onboarding.state === "WRAPPING_KEY_BACKUP" && <Backup />}
            {onboarding.state === "WRAPPING_KEY_SIGN_IN" && <Authentication />}
            {isViewSelected("ADMIN_PRE", onboarding) && <Prerequisite />}
            {isViewSelected("ADMIN_CONF", onboarding) && (
              <ConfigurationAdministrators />
            )}
            {isViewSelected("ADMIN_REGISTER", onboarding) && <Registration />}
            {isViewSelected("ADMIN_SCHEME", onboarding) && (
              <AdministrationScheme
                onChange={changeNbRequired}
                total={onboarding.registering.admins.length}
                number={onboarding.quorum}
              />
            )}
            {isViewSelected("SEED_SIGN", onboarding) && <SignIn />}
            {isViewSelected("SEED_PRE", onboarding) && <PrerequisiteSeed />}
            {isViewSelected("SEED_CONF", onboarding) && <ConfigurationSeed />}
            {isViewSelected("SEED_BACK", onboarding) && <Backup />}
            {isViewSelected("SEED_PROV", onboarding) && <Provisionning />}
            {isViewSelected("CONFIRMATION", onboarding) && (
              <ConfirmationGlobal />
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
