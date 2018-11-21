//@flow
import React, { Component, Fragment } from "react";
import ConfirmationCancel from "containers/Onboarding/ConfirmationCancel";
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
  openAdminValidationChannel,
  wipe,
  toggleDeviceModal,
  addAdminValidation
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import SharedOwnerValidationDevice from "./SharedOwnerValidationDevice";
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
  onWipe: Function,
  onGetSigninChallenge: Function,
  onToggleSignin: Function,
  onOpenAdminValidationChannel: () => void,
  onAddAdminValidation: (string, string) => void,
  onAddMessage: (string, string, string) => Function,
  onAddSignedIn: Function,
  t: Translate
};
type State = {
  deny: boolean
};
class SharedOwnerValidation extends Component<Props, State> {
  state = {
    deny: false
  };
  svg: ?Element;

  componentDidMount() {
    this.props.onOpenAdminValidationChannel();
  }

  toggleCancelOnDevice = () => {
    this.setState({ deny: !this.state.deny });
  };

  signIn = (pubKey: string, signature: string) => {
    this.props.onAddAdminValidation(pubKey, signature);
    this.props.onToggleSignin();
  };

  render() {
    const {
      classes,
      onboarding,
      onWipe,
      onAddMessage,
      onToggleSignin,
      t
    } = this.props;
    if (onboarding.validating_shared_owner.channels.length === 0) {
      return <SpinnerCard />;
    }
    if (this.state.deny) {
      return (
        <ConfirmationCancel
          entity="Shared-Owners"
          toggle={this.toggleCancelOnDevice}
          wipe={onWipe}
          step="Shared-Owner registration confirmation"
          title="Shared-Owners registration confirmation"
        />
      );
    }
    return (
      <div className={classes.base}>
        <Title>{t("onboarding:so_validation.title")}</Title>
        <BlurDialog open={onboarding.device_modal} onClose={onToggleSignin}>
          <SharedOwnerValidationDevice
            channels={onboarding.validating_shared_owner.channels}
            onAddMessage={onAddMessage}
            toggleCancelOnDevice={this.toggleCancelOnDevice}
            onFinish={this.signIn}
            cancel={onToggleSignin}
          />
        </BlurDialog>
        <Introduction>{t("onboarding:so_validation.desc")}</Introduction>
        <div className={classes.flex}>
          <div className={classes.flexWrapper}>
            <CircleProgress
              label={t("onboarding:master_seed_signin.members_present")}
              nb={onboarding.validating_shared_owner.admins.length}
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
                    onboarding.validating_shared_owner.admins.length ===
                    onboarding.registering.admins.length
                })}
                onClick={
                  onboarding.validating_shared_owner.admins.length ===
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
                {onboarding.validating_shared_owner.admins.length}{" "}
                {t("onboarding:master_seed_signin.signed_in")},{" "}
                {onboarding.registering.admins.length}{" "}
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
                    onboarding.validating_shared_owner.admins.length <
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
  onOpenAdminValidationChannel: () => dispatch(openAdminValidationChannel()),
  onToggleSignin: () => dispatch(toggleDeviceModal()),
  onAddAdminValidation: (key, sign) => dispatch(addAdminValidation(key, sign)),
  onWipe: () => dispatch(wipe()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type))
});

export default connect(mapState, mapDispatch)(
  withStyles(styles)(translate()(SharedOwnerValidation))
);
