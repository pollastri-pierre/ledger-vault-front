//@flow
import React, { Component, Fragment } from "react";
import CircleProgress from "components/CircleProgress";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import cx from "classnames";
import BlurDialog from "components/BlurDialog";
import { withStyles } from "@material-ui/core/styles";
import DialogButton from "components/buttons/DialogButton";
import Plus from "components/icons/full/Plus";
import SpinnerCard from "components/spinners/SpinnerCard";
import { connect } from "react-redux";
import {
  getSigninChallenge,
  wipe,
  toggleDeviceModal,
  addSignedIn
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import SignInDevice from "./SignInDevice";
import Footer from "./Footer";
import { Title, Introduction } from "components/Onboarding";

const styles = {
  flex: { display: "flex", justifyContent: "space-between", marginBottom: 50 },
  base: {
    "& strong": {
      fontSize: 12
    }
  },
  sign: {
    fontSize: 11,
    color: "#27d0e2",
    fontWeight: 600,
    textDecoration: "none",
    textTransform: "uppercase",
    display: "block",
    cursor: "pointer"
  },
  counter: {
    fontSize: 11,
    color: "#767676"
  },
  sep: {
    width: 220,
    height: 1,
    background: "#eeeeee",
    margin: "20px 0 20px 0"
  },
  flexWrapper: {
    flex: 1
  },
  disabled: {
    opacity: 0.5,
    cursor: "default"
  },
  icon: {
    width: 10,
    marginRight: 5
  }
};

type Props = {
  onboarding: *,
  classes: { [$Keys<typeof styles>]: string },
  onNextStep: Function,
  onGetSigninChallenge: Function,
  onToggleSignin: Function,
  onAddMessage: (string, string, string) => Function,
  onAddSignedIn: Function,
  t: Translate
};
class SignIn extends Component<Props> {
  svg: ?Element;

  componentDidMount() {
    this.props.onGetSigninChallenge();
  }

  signIn = (pubKey: string, signature: string) => {
    this.props.onAddSignedIn(pubKey, signature);
    this.props.onToggleSignin();
  };

  render() {
    const { classes, onboarding, onAddMessage, onToggleSignin, t } = this.props;
    if (!onboarding.signin.challenge) {
      return <SpinnerCard />;
    }
    return (
      <div className={classes.base}>
        <Title>{t("onboarding:admin_signin.title")}</Title>
        <BlurDialog open={onboarding.device_modal} onClose={onToggleSignin}>
          <SignInDevice
            challenge={onboarding.signin.challenge.challenge}
            onAddMessage={onAddMessage}
            keyHandles={onboarding.signin.challenge.key_handle}
            onFinish={this.signIn}
            cancel={onToggleSignin}
          />
        </BlurDialog>
        <Introduction>{t("onboarding:admin_signin.desc")}</Introduction>
        <div className={classes.flex}>
          <div className={classes.flexWrapper}>
            <CircleProgress
              label={t("onboarding:master_seed_signin.members_present")}
              nb={onboarding.signin.admins.length}
              total={onboarding.registering.admins.length}
            />
          </div>
          <div className={classes.flexWrapper}>
            <strong>{t("onboarding:master_seed_signin.ask_admin")}</strong>
            <div className={classes.sep} />
            <div>
              <div
                className={cx(classes.sign, {
                  [classes.disabled]:
                    onboarding.signin.admins.length ===
                    onboarding.registering.admins.length
                })}
                onClick={
                  onboarding.signin.admins.length ===
                  onboarding.registering.admins.length
                    ? () => false
                    : onToggleSignin
                }
              >
                <Plus className={classes.icon} />
                {onboarding.signin.admins.length === 0 ? (
                  <span className="test-onboarding-signin">
                    {t("onboarding:master_seed_signin.signin")}
                  </span>
                ) : (
                  <span className="test-onboarding-signin">
                    {t("onboarding:master_seed_signin.signin_next")}
                  </span>
                )}
              </div>
              <span className={classes.counter}>
                {onboarding.signin.admins.length}{" "}
                {t("onboarding:master_seed_signin.signed_in")},{" "}
                {onboarding.registering.admins.length -
                  onboarding.signin.admins.length}{" "}
                {t("onboarding:master_seed_signin:remaining")}
              </span>
            </div>
          </div>
        </div>
        <Footer
          isBack={false}
          render={(onNext, onPrevious) => {
            return (
              <Fragment>
                <DialogButton onTouchTap={onPrevious}>
                  {t("common:back")}
                </DialogButton>
                <DialogButton
                  highlight
                  onTouchTap={onNext}
                  disabled={
                    onboarding.signin.admins.length <
                    onboarding.registering.admins.length
                  }
                >
                  {t("common:continue")}
                </DialogButton>
              </Fragment>
            );
          }}
        />
      </div>
    );
  }
}

const mapState = state => ({
  onboarding: state.onboarding
});

const mapDispatch = (dispatch: *) => ({
  onGetSigninChallenge: () => dispatch(getSigninChallenge()),
  onToggleSignin: () => dispatch(toggleDeviceModal()),
  onAddSignedIn: (key, sign) => dispatch(addSignedIn(key, sign)),
  onWipe: () => dispatch(wipe()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type))
});

export default connect(mapState, mapDispatch)(
  withStyles(styles)(translate()(SignIn))
);
