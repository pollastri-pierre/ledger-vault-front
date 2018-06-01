//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
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
  data: {
    last_name: string,
    first_name: string,
    email: string,
    picture?: string
  }
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
      const device = await await createDevice();
      const { pubKey } = await device.getPublicKey(U2F_PATH, false);
      const confidentiality = await device.getPublicKey(CONFIDENTIALITY_PATH);
      const validation = await device.getPublicKey(VALIDATION_PATH);
      this.setState({ active: 1 });

      const u2f_register = await device.register(
        Buffer.from(this.props.challenge, "base64"),
        APPID_VAULT_ADMINISTRATOR
      );

      this.setState({ active: 2 });

      const data = {
        u2f_register: u2f_register.rawResponse,
        pub_key: pubKey,
        key_handle: u2f_register.keyHandle.toString("hex"),
        validation: {
          public_key: validation.pubKey,
          attestation: validation.signature.toString("hex")
        },
        confidentiality: {
          public_key: confidentiality.pubKey,
          attestation: confidentiality.signature.toString("hex")
        },
        first_name: this.props.data.first_name,
        last_name: this.props.data.last_name,
        email: this.props.data.email,
        picture: this.props.data.picture
      };

      this.props.finish(data);
    } catch (e) {
      console.error(e);
      if (e.statusCode && e.statusCode === 27013) {
        this.props.cancel();
      } else {
        this.onStart();
      }
    }
  };

  render() {
    const { steps, cancel } = this.props;
    return (
      <StepDeviceGeneric
        step={this.state.active}
        steps={steps}
        title="Register device"
        cancel={cancel}
      />
    );
  }
}

export { StepDevice };
export default withStyles(styles)(StepDevice);
