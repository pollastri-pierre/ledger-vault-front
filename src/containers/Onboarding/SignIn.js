//@flow
import React, { Component } from "react";
import cx from "classnames";
import BlurDialog from "components/BlurDialog";
import { withStyles } from "@material-ui/core/styles";
import * as d3 from "d3";
import DialogButton from "components/buttons/DialogButton";
import Plus from "components/icons/full/Plus";
import SpinnerCard from "components/spinners/SpinnerCard";
import { connect } from "react-redux";
import {
  getShardChallenge,
  toggleSignin,
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
  onAddSignedIn: Function
};
class SignIn extends Component<Props> {
  svg: ?Element;

  componentDidMount() {
    if (!this.props.onboarding.shardChallenge) {
      this.props.onGetShardChallenge();
    }
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
      (this.props.onboarding.signed.length /
        this.props.onboarding.members.length);
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
    const { classes, onboarding, onToggleSignin } = this.props;
    if (!onboarding.shardChallenge) {
      return <SpinnerCard />;
    }
    return (
      <div className={classes.base}>
        <Title>Sign-in</Title>
        <BlurDialog open={onboarding.signInModal} onClose={onToggleSignin}>
          <SignInDevice
            challenge={onboarding.shardChallenge}
            keyHandles={onboarding.key_handles}
            onFinish={this.signIn}
          />
        </BlurDialog>
        <Introduction>
          The presence of the administrators defined in the previous
          administrator scheme is required to generate the master seed.
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
                {onboarding.signed.length}/{onboarding.members.length}
              </strong>
              <span>members present</span>
            </div>
          </div>
          <div className={classes.flexWrapper}>
            <strong>
              Ask each administrator to sign-in using their Ledger Blue devices.
            </strong>
            <div className={classes.sep} />
            <div>
              <div
                className={cx(classes.sign, {
                  [classes.disabled]:
                    onboarding.signed.length === onboarding.members.length
                })}
                onClick={
                  onboarding.signed.length === onboarding.members.length
                    ? onToggleSignin
                    : onToggleSignin
                }
              >
                <Plus className={classes.icon} />
                {onboarding.signed.length === 0 ? (
                  <span>Sign in</span>
                ) : (
                  <span>Sign in next Administrator</span>
                )}
              </div>
              <span className={classes.counter}>
                {onboarding.signed.length} signed-in,{" "}
                {onboarding.members.length - onboarding.signed.length} remaining
              </span>
            </div>
          </div>
        </div>
        <SubTitle>To continue</SubTitle>
        <ToContinue>
          Gather the number of administrators defined previsoulsy and make sure
          the administration scheme is satisfied by requesting administrators to
          sign-in.
        </ToContinue>
        <Footer
          isBack={false}
          nextState
          render={(onPrev, onNext) => {
            return (
              <DialogButton
                highlight
                onTouchTap={onNext}
                disabled={onboarding.signed.length < onboarding.members.length}
              >
                Continue
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
  onGetShardChallenge: () => dispatch(getShardChallenge()),
  onToggleSignin: () => dispatch(toggleSignin()),
  onAddSignedIn: (key, sign) => dispatch(addSignedIn(key, sign)),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
  onNextStep: () => dispatch(nextStep())
});

export default connect(mapState, mapDispatch)(withStyles(styles)(SignIn));
