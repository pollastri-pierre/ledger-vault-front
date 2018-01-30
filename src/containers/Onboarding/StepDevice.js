//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import network from "network";
import createDevice, {
  U2F_PATH,
  CONFIDENTIALITY_PATH,
  APPID_VAULT_BOOTSTRAP,
  VALIDATION_PATH
} from "device";
import StepDeviceGeneric from "./StepDeviceGeneric";

const styles = {
  base: { width: 400, padding: "40px 40px 80px 40px" },
  title: { textAlign: "center" },
  step: {
    fontSize: 13,
    paddingLeft: 20,
    position: "relative",
    "&:before": {
      position: "absolute",
      top: 27,
      left: 0
    }
  },
  footer: {
    position: "absolute",
    width: "100%",
    height: 51,
    bottom: 0,
    left: 0,
    display: "flex",
    padding: "0 40px 0 40px",
    justifyContent: "space-between"
  }
};

type Props = {
  title: string,
  steps: string[],
  cancel: Function,
  finish: Function,
  challenge: string,
  data: *
};

type State = {
  active: number
};
class StepDevice extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { active: 0 };
  }
  componentDidMount() {
    // make interval call to see if the blue is connected
    // when the blue is connected, ask it to sign the challenge
    // when signed, POST to API and close the modal

    this.onStart();
  }

  onStart = async () => {
    const device = await createDevice();
    const confidentiality = await device.fakeGetPublicKey(CONFIDENTIALITY_PATH);
    const public_key = await device.fakeGetPublicKey(U2F_PATH);
    const validation = await device.fakeGetPublicKey(VALIDATION_PATH);

    const challenge_answer = await device.fakeRegister(
      this.props.challenge,
      APPID_VAULT_BOOTSTRAP
    );

    const data = {
      challenge_answer,
      confidentiality_key: btoa(confidentiality["publicKey"]),
      confidentiality_attestation: btoa(confidentiality["attestation"]),
      validation_key: btoa(validation["publicKey"]),
      validation_attestation: btoa(validation["attestation"]),
      public_key: btoa(public_key),
      first_name: this.props.data.first_name.value,
      last_name: this.props.data.last_name.value,
      email: this.props.data.email.value,
      picture: this.props.data.picture.value
    };

    setTimeout(async () => {
      this.setState({ active: 1 });
      /* const { challenge } =  */ await network(
        "/provisioning/administrators/register",
        "POST",
        data
      );
      this.setState({ active: 2 });
      this.checkUnplugged();
    }, 500);
  };

  sign = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ signature: "signature" });
      }, 500);
    });
  };

  checkUnplugged = (pubKey, signature) => {
    setTimeout(() => {
      this.setState({ active: 3 });
      const result = {
        public_key: pubKey,
        challenge_answer: signature
      };
      this.props.finish(result);
    }, 500);
  };
  render() {
    const { steps, cancel } = this.props;
    return (
      <StepDeviceGeneric
        step={this.state.active}
        steps={steps}
        title="Register device"
        close={cancel}
      />
    );
  }
}

export default withStyles(styles)(StepDevice);
