import React, { Component } from "react";
import {
  Title,
  Introduction,
  SubTitle,
  ToContinue
} from "components/Onboarding";
import Authenticator from "./Authenticator";
import { withStyles } from "material-ui/styles";
import cx from "classnames";
import DialogButton from "components/buttons/DialogButton";
import SpinnerCard from "components/spinners/SpinnerCard";
import createDevice, { U2F_PATH } from "device";
import Footer from "./Footer";
import {
  getCommitChallenge,
  commitAdministrators
} from "redux/modules/onboarding";
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
const mapDispatch = dispatch => ({
  onGetCommitChallenge: () => dispatch(getCommitChallenge()),
  onCommitAdministrators: data => dispatch(commitAdministrators(data))
});

class ConfirmationAdministrators extends Component<> {
  constructor(props) {
    super(props);
    this.state = { step: 1 };
  }
  componentDidMount() {
    const { onboarding, onGetCommitChallenge } = this.props;
    if (!onboarding.commit_challenge) {
      onGetCommitChallenge();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.onboarding.commit_challenge !==
      this.props.onboarding.commit_challenge
    ) {
      this.onStart();
    }
  }

  onStart = async () => {
    const { onCommitAdministrators } = this.props;
    const device = await createDevice();
    const pubKeyData = await device.fakeGetPublicKey(U2F_PATH);
    this.setState({ plugged: true, step: 2 });
    const auth = await device.fakeAuthenticate();
    const data = { pub_key: pubKeyData, authentication: auth };
    await onCommitAdministrators(data);
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
          <span className={classes.value}>6 registerered administrators</span>
        </div>
        <div className={cx(classes.flex, classes.second)}>
          <SubTitle>Administration scheme</SubTitle>
          <span className={classes.value}>Require 4 members out of 6</span>
        </div>
        <Authenticator step={this.state.step} />
        <Footer
          render={(onPrev, onNext) => (
            <DialogButton
              highlight
              onTouchTap={() => onNext()}
              disabled={!onboarding.committed_administrators}
            >
              Continue
            </DialogButton>
          )}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatch)(
  withStyles(styles)(ConfirmationAdministrators)
);
