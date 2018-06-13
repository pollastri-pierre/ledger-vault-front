//@flow
import React, { Component } from "react";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import cx from "classnames";
import BlurDialog from "components/BlurDialog";
import { withStyles } from "@material-ui/core/styles";
import * as d3 from "d3";
import DialogButton from "components/buttons/DialogButton";
import Plus from "components/icons/full/Plus";
import SpinnerCard from "components/spinners/SpinnerCard";
import { connect } from "react-redux";
import {
  getSigninChallenge,
  toggleDeviceModal,
  addSignedIn,
  nextStep
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import SignInDevice from "./SignInDevice";
import Footer from "./Footer";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";

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
  circle: {
    width: 124,
    height: 124,
    borderRadius: "50%",
    // border: "3px solid #e2e2e2",
    fontSize: 13,
    textAlign: "center",
    paddingTop: 30,
    position: "relative",
    "& > span": {
      display: "inline-block",
      marginTop: 5,
      width: 60
    },
    "& strong": {
      fontSize: 18,
      display: "block"
    }
  },
  flexWrapper: {
    flex: 1
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120
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
  onGetShardChallenge: Function,
  onOpenShardsChannel: Function,
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

  componentDidUpdate() {
    const $svg = this.svg;
    if (!$svg) return;
    const radius = 60;
    const boxSize = radius * 2;
    const border = 3;
    const endAngle = Math.PI * 2;

    const circle = d3
      .arc()
      .startAngle(0)
      .innerRadius(radius)
      .outerRadius(radius - border);
    const svg = d3
      .select($svg)
      .append("svg")
      .attr("width", boxSize)
      .attr("height", boxSize);
    const g = svg
      .append("g")
      .attr("transform", "translate(" + boxSize / 2 + "," + boxSize / 2 + ")");

    g
      .append("path")
      .attr("fill", "#e2e2e2")
      .attr("stroke", "none")
      .attr("stroke-width", "3px")
      .attr("d", circle.endAngle(endAngle));

    const percentage =
      2 *
      (this.props.onboarding.signin.admins.length /
        this.props.onboarding.registering.admins.length);
    g
      .append("path")
      .attr("fill", "#27d0e2")
      .attr("stroke", "none")
      .attr("stroke-width", 3 + "px")
      .attr("d", circle.endAngle(Math.PI * percentage));
  }

  signIn = (pubKey: string, signature: string) => {
    this.props.onAddSignedIn(pubKey, signature);
    this.props.onToggleSignin();
  };

  render() {
    const { classes, onboarding, onToggleSignin, t } = this.props;
    if (!onboarding.signin.challenge) {
      return <SpinnerCard />;
    }
    return (
      <div className={classes.base}>
        <Title>{"onboarding:master_seed_signin.title"}</Title>
        <BlurDialog open={onboarding.device_modal} onClose={onToggleSignin}>
          <SignInDevice
            challenge={onboarding.signin.challenge.challenge}
            keyHandles={onboarding.signin.challenge.key_handle}
            onFinish={this.signIn}
          />
        </BlurDialog>
        <Introduction>
          {t("onboarding:master_seed_signin.description")}
        </Introduction>
        <div className={classes.flex}>
          <div className={classes.flexWrapper}>
            <div className={classes.circle}>
              <svg
                ref={c => {
                  this.svg = c;
                }}
                className={classes.svg}
              />
              <strong>
                {onboarding.signin.admins.length}/{onboarding.registering.admins.length}
              </strong>
              <span>{t("onboarding:master_seed_signin.members_present")}</span>
            </div>
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
                    ? onToggleSignin
                    : onToggleSignin
                }
              >
                <Plus className={classes.icon} />
                {onboarding.signin.admins.length === 0 ? (
                  <span>{t("onboarding:master_seed_signin.signin")}</span>
                ) : (
                  <span>{t("onboarding:master_seed_signin.signin_next")}</span>
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
        <SubTitle>{t("onboarding:tocontinue")}</SubTitle>
        <ToContinue>
          {t("onboarding:master_seed_signin.to_continue")}
        </ToContinue>
        <Footer
          isBack={false}
          render={onNext => {
            return (
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
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
  onNextStep: () => dispatch(nextStep())
});

export default connect(mapState, mapDispatch)(
  withStyles(styles)(translate()(SignIn))
);
