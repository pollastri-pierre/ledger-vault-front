import React, { Component } from "react";
import StepDeviceGeneric from "./StepDeviceGeneric";
const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the master seed creation request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];

class GenerateSeed extends Component {
  constructor(props) {
    super(props);
    this.state = { step: 0 };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ step: 1 });
    }, 500);
    setTimeout(() => {
      this.setState({ step: 2 });
    }, 1000);
    setTimeout(() => {
      this.setState({ step: 3 });
      this.props.onFinish("public_key", "signature");
    }, 1500);
  }
  render() {
    return (
      <StepDeviceGeneric
        steps={steps}
        title="Generate the seed with your device"
        step={this.state.step}
      />
    );
  }
}
export default GenerateSeed;
