//@flow
import React, { Component } from "react";
import createDevice, { U2F_PATH, APPID_VAULT_BOOTSTRAP } from "device";
import { Title, Introduction } from "components/Onboarding";
import DialogButton from "components/buttons/DialogButton";
import { connect } from "react-redux";
import Footer from "./Footer";
import SpinnerCard from "components/spinners/SpinnerCard";
import {
  getBootstrapChallenge,
  getBootstrapToken
} from "redux/modules/onboarding";

import Authenticator from "./Authenticator.js";

type Props = {
  onboarding: *,
  onGetBootstrapChallenge: Function,
  onGetBootstrapToken: Function,
  onPostChallenge: Function
};

type State = {
  step: number,
  plugged: boolean
};

const mapState = state => ({
  onboarding: state.onboarding
});
const mapDispatch = dispatch => ({
  onGetBootstrapChallenge: () => dispatch(getBootstrapChallenge()),
  onGetBootstrapToken: data => dispatch(getBootstrapToken(data))
});
class Authentication extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { step: 1, plugged: false };
  }

  componentDidMount() {
    const { onboarding, onGetBootstrapChallenge } = this.props;
    if (!onboarding.bootstrapChallenge) {
      onGetBootstrapChallenge();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.onboarding.bootstrapChallenge !==
      this.props.onboarding.bootstrapChallenge
    ) {
      this.onStart();
    }
  }

  onStart = async () => {
    const { onGetBootstrapToken } = this.props;
    const device = await createDevice();
    const { pub_key } = await device.fakeGetPublicKey(U2F_PATH);
    this.setState({ plugged: true, step: 2 });
    const auth = await device.fakeAuthenticate(
      this.props.challenge,
      APPID_VAULT_BOOTSTRAP
    );
    await onGetBootstrapToken(pub_key, auth);
    this.setState({ step: 3 });
    this.checkUnplugged();
  };

  checkUnplugged = () => {
    // we need a way to check if the device is unplugged
    setTimeout(() => {
      this.setState({
        plugged: false
      });
    }, 2000);
  };

  // TODO: continue button should be disabled until the redux store contains a bootstrapAuthToken AND the device is unplugged
  render() {
    const { onboarding } = this.props;
    if (!onboarding.bootstrapChallenge) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <Title>Authentication</Title>
        <Introduction>
          {" "}
          The configuration of your team's Ledger is restricted. Please connect
          your one-time authenticator to continue.{" "}
        </Introduction>
        <div style={{ marginTop: 70 }}>
          <Authenticator step={this.state.step} />
        </div>
        <Footer
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={!(onboarding.bootstrapAuthToken && !this.state.plugged)}
            >
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Authentication);
