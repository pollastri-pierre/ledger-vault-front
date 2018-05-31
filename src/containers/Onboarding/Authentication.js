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
import { addMessage } from "redux/modules/alerts";

import Authenticator from "./Authenticator.js";

type Props = {
  onboarding: *,
  onGetBootstrapChallenge: Function,
  onGetBootstrapToken: Function,
  onAddMessage: Function
};

type State = {
  step: number,
  plugged: boolean
};

const mapState = state => ({
  onboarding: state.onboarding
});
const mapDispatch = (dispatch: *) => ({
  onGetBootstrapChallenge: () => dispatch(getBootstrapChallenge()),
  onAddMessage: (title, content, success) =>
    dispatch(addMessage(title, content, success)),
  onGetBootstrapToken: (k, auth) => dispatch(getBootstrapToken(k, auth))
});
class Authentication extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 1, plugged: false };
  }

  componentDidMount() {
    const { onboarding, onGetBootstrapChallenge } = this.props;
    if (!onboarding.bootstrapChallenge) {
      onGetBootstrapChallenge();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.onboarding.bootstrapChallenge !==
      this.props.onboarding.bootstrapChallenge
    ) {
      this.onStart();
    }
  }

  onStart = async () => {
    this.setState({ step: 1 });
    const { onGetBootstrapToken } = this.props;
    try {
      const device = await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      // // TODO FIXME not sure what these will be
      const instanceName = "";
      const instanceReference = "";
      const instanceURL = "";
      const agentRole = "";

      const { bootstrapChallenge } = this.props.onboarding;

      const challenge = bootstrapChallenge.challenge;
      // const keyHandle = bootstrapChallenge.key_handle[pubKey.toUpperCase()];
      const keyHandle = bootstrapChallenge.key_handle.key_handle;

      const sign = await await device.authenticateBootstrap(
        Buffer.from(challenge, "base64"),
        APPID_VAULT_BOOTSTRAP,
        Buffer.from(keyHandle, "base64"),
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );
      this.setState({ plugged: true, step: 2 });
      await onGetBootstrapToken(pubKey, sign);
      this.setState({ step: 3 });
    } catch (e) {
      console.error(e);
      console.error(e.metaData);
      this.props.onAddMessage("Error", "Oups something went wrong", "error");
      this.onStart();
    }
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
          {
            " The configuration of your team's Ledger is restricted. Please connect your one-time authenticator to continue."
          }
        </Introduction>
        <div style={{ marginTop: 70 }}>
          <Authenticator step={this.state.step} />
        </div>
        <Footer
          nextState
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={onNext}
              disabled={!onboarding.bootstrapAuthToken}
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

export default connect(mapState, mapDispatch)(Authentication);
