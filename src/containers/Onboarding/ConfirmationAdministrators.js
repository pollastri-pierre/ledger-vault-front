//@flow
import React, { Component } from "react";
import createDevice, { APPID_VAULT_BOOTSTRAP, U2F_PATH } from "device";
import { Title, Introduction, SubTitle } from "components/Onboarding";
import Authenticator from "./Authenticator";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";
import DialogButton from "components/buttons/DialogButton";
import SpinnerCard from "components/spinners/SpinnerCard";
import Footer from "./Footer";
import {
  getCommitChallenge,
  commitAdministrators
} from "redux/modules/onboarding";
import { addMessage } from "redux/modules/alerts";
import { connect } from "react-redux";

const styles = {
  flex: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #eeeeee"
  },
  second: {
    paddingTop: 14,
    border: 0,
    marginBottom: 40
  },
  value: {
    fontSize: 13
  }
};
const mapStateToProps = state => ({
  onboarding: state.onboarding
});
const mapDispatch = (dispatch: *) => ({
  onGetCommitChallenge: () => dispatch(getCommitChallenge()),
  onCommitAdministrators: (key, signature) =>
    dispatch(commitAdministrators(key, signature)),
  onAddMessage: (title, content, success) =>
    dispatch(addMessage(title, content, success))
});

type Props = {
  onGetCommitChallenge: Function,
  onCommitAdministrators: Function,
  onAddMessage: (string, string, string) => Function,
  onboarding: *,
  classes: { [$Keys<typeof styles>]: string }
};

type State = {
  step: number,
  plugged: boolean
};
class ConfirmationAdministrators extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 1, plugged: false };
  }
  componentDidMount() {
    const { onboarding, onGetCommitChallenge } = this.props;
    if (!onboarding.commit_challenge) {
      onGetCommitChallenge();
    }
  }
  componentDidUpdate(nextProps: Props) {
    if (
      nextProps.onboarding.commit_challenge !==
      this.props.onboarding.commit_challenge
    ) {
      this.onStart();
    }
  }

  onStart = async () => {
    this.setState({ step: 1 });
    try {
      const device = await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      const instanceName = "";
      const instanceReference = "";
      const instanceURL = "";
      const agentRole = "";

      const keyHandle = this.props.onboarding.commit_challenge.key_handle
        .key_handle;
      const challenge = this.props.onboarding.commit_challenge.challenge;

      const commit_signature = await device.authenticateBootstrap(
        Buffer.from(challenge, "base64"),
        APPID_VAULT_BOOTSTRAP,
        Buffer.from(keyHandle, "base64"),
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );

      this.setState({ step: 2 });
      await this.props.onCommitAdministrators(pubKey, commit_signature);
      this.setState({ step: 3 });
    } catch (e) {
      console.error(e);
      this.props.onAddMessage("Error", "Oups something went wrong", "error");
      this.onStart();
    }
  };

  render() {
    const { classes, onboarding } = this.props;
    if (!onboarding.commit_challenge) {
      return <SpinnerCard />;
    }
    return (
      <div>
        <Title>Confirmation</Title>
        <Introduction>
          Confirm the creation of your team by connecting your one-time
          authenticator.{" "}
          <strong>It will not possible to change members after this.</strong>
        </Introduction>
        <div className={classes.flex}>
          <SubTitle>Team members</SubTitle>
          <span className={classes.value}>
            {onboarding.members.length} registerered administrators
          </span>
        </div>
        <div className={cx(classes.flex, classes.second)}>
          <SubTitle>Administration scheme</SubTitle>
          <span className={classes.value}>
            Require {onboarding.nbRequired} members out of{" "}
            {onboarding.members.length}
          </span>
        </div>
        <Authenticator step={this.state.step} />
        <Footer
          nextState
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={() => onNext()}
              disabled={!onboarding.partition_locked}
            >
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

export { ConfirmationAdministrators };
export default connect(mapStateToProps, mapDispatch)(
  withStyles(styles)(ConfirmationAdministrators)
);
