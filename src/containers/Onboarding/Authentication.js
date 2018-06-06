//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import { SeedStatus, ProfileIcon } from "./Provisioning";
import GenerateSeed from "./GenerateSeed";
import BlurDialog from "components/BlurDialog";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { connect } from "react-redux";
import Footer from "./Footer";
import SpinnerCard from "components/spinners/SpinnerCard";
import {
  getWrapsChannel,
  toggleGenerateSeed,
  addWrapShard
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";

const styles = {
  steps: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 35
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    margin: "0 0 12px 0"
  },
  step: {
    paddingRight: 30,
    paddingLeft: 25,
    "&:first-child": {
      paddingLeft: 0
    },
    transition: "all 200ms ease"
  },
  disabled: {
    opacity: 0.2
  },
  separator: {
    width: 1,
    height: 94,
    background: "#eeeeee"
  }
};

type Props = {
  onboarding: *,
  onGetWrapsChannel: Function,
  onAddWrapShard: Function,
  onToggleGenerateSeed: Function,
  onAddMessage: Function,
  classes: { [$Keys<typeof styles>]: string }
};

type State = {
  step: number,
  plugged: boolean
};

const mapState = state => ({
  onboarding: state.onboarding
});
const mapDispatch = (dispatch: *) => ({
  onGetWrapsChannel: () => dispatch(getWrapsChannel()),
  onAddWrapShard: data => dispatch(addWrapShard(data)),
  onToggleGenerateSeed: () => dispatch(toggleGenerateSeed()),
  onAddMessage: (title, content, success) =>
    dispatch(addMessage(title, content, success))
});
class Authentication extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 1, plugged: false };
  }

  componentDidMount() {
    const { onGetWrapsChannel } = this.props;
    onGetWrapsChannel();
  }
  finish = data => {
    this.props.onToggleGenerateSeed();
    this.props.onAddWrapShard(data);
  };

  render() {
    const { onboarding, onToggleGenerateSeed, classes } = this.props;
    console.log(onboarding);
    if (!onboarding.wraps_channel) {
      return <SpinnerCard />;
    }

    return (
      <div>
        <Title>Authentication</Title>
        <BlurDialog
          open={onboarding.generateSeedModal}
          onClose={onToggleGenerateSeed}
        >
          <GenerateSeed
            shards_channel={onboarding.wraps_channel}
            onFinish={this.finish}
            wraps
          />
        </BlurDialog>
        <Introduction>
          {
            " The configuration of your team's Ledger is restricted. Please connect your one-time authenticator to continue."
          }
        </Introduction>
        <div className={classes.steps}>
          <div className={classes.step}>
            <ProfileIcon />
            <div className={classes.title}>First owner</div>
            <SeedStatus
              generated={onboarding.wraps.length > 0}
              open={onToggleGenerateSeed}
            />
          </div>
          <div className={classes.separator} />
          <div
            className={cx(classes.step, {
              [classes.disabled]: onboarding.wraps.length === 0
            })}
          >
            <ProfileIcon />
            <div className={classes.title}>Second owner</div>
            <SeedStatus
              generated={onboarding.wraps.length > 1}
              open={onToggleGenerateSeed}
            />
          </div>
          <div className={classes.separator} />
          <div
            className={cx(classes.step, {
              [classes.disabled]: onboarding.wraps.length < 2
            })}
          >
            <ProfileIcon />
            <div className={classes.title}>Third owner</div>
            <SeedStatus
              generated={onboarding.wraps.length > 2}
              open={onToggleGenerateSeed}
            />
          </div>
        </div>
        <Footer
          nextState
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={onboarding.wraps.length < 3}
            >
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

// useful for test
export { Authentication };

export default connect(mapState, mapDispatch)(
  withStyles(styles)(Authentication)
);
