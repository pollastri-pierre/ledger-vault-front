//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import network from "network";
import createDevice, {
  U2F_PATH,
  CONFIDENTIALITY_PATH,
  APPID_VAULT_ADMINISTRATOR,
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
  constructor(props: Props) {
    super(props);

    this.state = { active: 0 };
  }
  componentDidMount() {
    this.onStart();
  }

  onStart = async () => {
    try {
      this.setState({ active: 0 });
      const device = await createDevice();
      const confidentiality = await device.getPublicKey(CONFIDENTIALITY_PATH);
      const public_key = await device.getPublicKey(U2F_PATH);
      const validation = await device.getPublicKey(VALIDATION_PATH);

      const instanceName = "_";
      const instanceReference = "_";
      const instanceURL = "_";
      const agentRole = "_";
      const challenge_answer = await device.register(
        this.props.challenge,
        APPID_VAULT_ADMINISTRATOR,
        instanceName,
        instanceReference,
        instanceURL,
        agentRole
      );

      this.setState({ active: 1 });

      const data = {
        challenge_answer,
        confidentiality_key: confidentiality["pubKey"],
        confidentiality_attestation: confidentiality["signature"],
        validation_key: validation["pubKey"],
        validation_attestation: validation["signature"],
        pub_key: public_key,
        first_name: this.props.data.first_name.value,
        last_name: this.props.data.last_name.value,
        email: this.props.data.email.value,
        picture: this.props.data.picture.value
      };

      await network("/provisioning/administrators/register", "POST", data);
      this.setState({ active: 2 });
      this.props.finish(data);
    } catch (e) {
      console.error(e);
      this.onStart();
    }
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

export { StepDevice };
export default withStyles(styles)(StepDevice);
