//@flow
import React, { Component } from "react";
import EditProfile from "components/EditProfile";
import StepDevice from "./StepDevice.js";

const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];
type Props = {
  classes: { [$keys<typeof styles>]: string },
  close: Function
};
type State = {
  step: number,
  data: *
};

class AddMember extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { step: 0 };
  }
  next = data => {
    // we are editing a member, no need to register device again
    if (this.props.member) {
      this.props.close();
      // TODO modify member in store redux and call the API too
    } else {
      this.setState({ step: 1, data: data });
    }
  };
  prev = () => {
    this.setState({ step: 0 });
  };

  finish = result => {
    this.setState({ step: 0 });
    const data = {};
    ["first_name", "last_name", "email", "picture"].forEach(key => {
      const value = this.state.data[key].value;
      data[key] = value;
    });
    data["role"] = "Administrator";
    data["public_key"] = result.public_key;
    data["challenge_answer"] = result.challenge_answer;
    this.props.finish(data);
  };

  render() {
    let label = "Continue";
    let profile = {
      first_name: "",
      last_name: "",
      email: "",
      picture: null
    };
    if (this.props.member) {
      profile = this.props.member;
      label = "save";
    }

    const { step } = this.state;

    if (step === 0) {
      return (
        <EditProfile
          title="Add new member"
          profile={profile}
          onSubmit={this.next}
          close={this.props.close}
          labelSubmit={label}
        />
      );
    } else if (step === 1) {
      return (
        <StepDevice
          steps={steps}
          title="Register device"
          close={this.props.close}
          finish={this.finish}
          cancel={this.prev}
          data={this.state.data}
          challenge={this.props.challenge}
        />
      );
    }
  }
}

export default AddMember;
