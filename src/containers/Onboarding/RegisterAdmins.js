//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import OrganizationQuery from "api/queries/OrganizationQuery";
import { withStyles } from "@material-ui/core/styles";
import createDevice, {
  checkToUpdate,
  U2F_PATH,
  U2F_TIMEOUT,
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
  history: *,
  cancel: Function,
  organization: *,
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
let _isMounted = false;

class RegisterAdmins extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { active: 0 };
  }

  componentDidMount() {
    _isMounted = true;
    this.onStart();
  }
  componentWillUnmount() {
    _isMounted = false;
  }

  onStart = async () => {
    if (_isMounted) {
      try {
        this.setState({ active: 0 });
        const { organization } = this.props;
        const device = await await createDevice();
        const isUpToDate = await checkToUpdate(device, () => {
          this.props.history.push("/update-app");
        });

        if (isUpToDate) {
          const { pubKey } = await device.getPublicKey(U2F_PATH, false);
          const confidentiality = await device.getPublicKey(
            CONFIDENTIALITY_PATH
          );
          const validation = await device.getPublicKey(VALIDATION_PATH);
          const attestation = await device.getAttestationCertificate();

          this.setState({ active: 1 });

          const { u2f_register, keyHandle } = await device.register(
            Buffer.from(this.props.challenge, "base64"),
            APPID_VAULT_ADMINISTRATOR,
            organization.name,
            organization.workspace,
            organization.domain_name,
            "Administrator"
          );

          this.setState({ active: 2 });

          const attestationOffset = 67 + u2f_register.readInt8(66);

          const u2f_register_attestation = Buffer.concat([
            u2f_register.slice(0, attestationOffset),
            Buffer.from([attestation.length]),
            attestation,
            u2f_register.slice(attestationOffset)
          ]);

          const validation_attestation = Buffer.concat([
            attestation,
            validation.signature
          ]);
          const confidentiality_attestation = Buffer.concat([
            attestation,
            confidentiality.signature
          ]);

          const data = {
            u2f_register: u2f_register_attestation.toString("hex"),
            pub_key: pubKey,
            key_handle: keyHandle.toString("hex"),
            validation: {
              public_key: validation.pubKey,
              attestation: validation_attestation.toString("hex")
            },
            confidentiality: {
              public_key: confidentiality.pubKey,
              attestation: confidentiality_attestation.toString("hex")
            },
            first_name: this.props.data.first_name,
            last_name: this.props.data.last_name,
            email: this.props.data.email,
            picture: this.props.data.picture
          };

          this.props.finish(data);
        }
      } catch (e) {
        console.error(e);
        if (e.statusCode && e.statusCode === 27013) {
          this.props.cancel();
        } else if (e.id && e.id === U2F_TIMEOUT) {
          //timeout
          this.onStart();
        }
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
        device={this.state.active < 2}
        cancel={cancel}
      />
    );
  }
}

export { RegisterAdmins };
export default connectData(withStyles(styles)(RegisterAdmins), {
  queries: {
    organization: OrganizationQuery
  }
});
