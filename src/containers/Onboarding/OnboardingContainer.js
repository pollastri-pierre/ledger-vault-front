//@flow
import React, { Component } from "react";
import cx from "classnames";
import { withStyles } from "material-ui/styles";
import Welcome from "./Welcome";
import Authentication from "./Authentication";
import Prerequisite from "./Prerequisite";
import PrerequisiteSeed from "./PrerequisiteSeed";
import ConfigurationAdministrators from "./ConfigurationAdministrators";
import ConfigurationSeed from "./ConfigurationSeed.js";
import Registration from "./Registration";
import ConfirmationAdministrators from "./ConfirmationAdministrators.js";
import SignIn from "./SignIn";
import Backup from "./Backup.js";
import Provisionning from "./Provisioning.js";
import ConfirmationGlobal from "./ConfirmationGlobal.js";
import AdministrationScheme from "./AdministrationScheme.js";
import logoBlack from "assets/img/logo-black.png";
import logoBlack2x from "assets/img/logo-black@2x.png";
import logoBlack3x from "assets/img/logo-black@3x.png";
import Menu from "./Menu";
import { connect } from "react-redux";
import { goToStep, changeNbRequired } from "redux/modules/onboarding";

const mapStateToProps = state => ({
  onboarding: state.onboarding
});

const mapDispatchToProps = dispatch => ({
  goToStep: step => dispatch(goToStep(step)),
  changeNbRequired: nb => dispatch(changeNbRequired(nb))
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
  changeNbRequired: Function
};

type State = {
  nbAdministrator: number,
  nbRequired: number
};

class OnboardingContainer extends Component<Props, State> {
  render() {
    const { classes, onboarding, changeNbRequired } = this.props;
    return (
      <div className={cx("App", classes.wrapper)}>
        <div className={classes.base}>
          <div className={classes.banner}>
            <img
              src={logoBlack}
              srcSet={`${logoBlack2x} 2x, ${logoBlack3x} 3x`}
              alt="Ledger Vault"
            />
            <a href="#" className={classes.support}>
              support
            </a>
          </div>
          <Menu nbMember={onboarding.members.length} onboarding={onboarding} />
          <div className={classes.content}>
            {onboarding.currentStep === 0 && <Welcome />}
            {onboarding.currentStep === 1 && <Authentication />}
            {onboarding.currentStep === 2 && <Prerequisite />}
            {onboarding.currentStep === 3 && <ConfigurationAdministrators />}
            {onboarding.currentStep === 4 && <Registration />}
            {onboarding.currentStep === 5 && (
              <AdministrationScheme
                number={onboarding.nbRequired}
                total={onboarding.members.length}
                onChange={changeNbRequired}
              />
            )}
            {onboarding.currentStep === 6 && <ConfirmationAdministrators />}
            {onboarding.currentStep === 7 && <SignIn />}
            {onboarding.currentStep === 8 && <PrerequisiteSeed />}
            {onboarding.currentStep === 9 && <ConfigurationSeed />}
            {onboarding.currentStep === 10 && <Backup />}
            {onboarding.currentStep === 11 && <Provisionning />}
            {onboarding.currentStep === 12 && <ConfirmationGlobal />}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(OnboardingContainer)
);
