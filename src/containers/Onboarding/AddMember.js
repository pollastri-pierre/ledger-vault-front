//@flow
import React, { Component } from "react";
import EditProfile from "components/EditProfile";
import StepDevice from "./StepDevice.js";
import type { Member } from "data/types";

const steps = [
  "Connect your Ledger Blue to this computer and make sure it is powered on and unlocked by entering your personal PIN.",
  "Open the Vault app on the dashboard. When displayed, confirm the register request on the device.",
  "Close the Vault app using the upper right square icon and disconnect the device from this computer."
];
type Props = {
  close: Function,
  finish: Function,
  setAlert: Function,
  editMember: Function,
  member: Member,
  challenge: string
};
type State = {
  step: number,
  data: any
};

class AddMember extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      data: {
        email: props.member ? props.member.email : "",
        first_name: props.member ? props.member.first_name : "",
        last_name: props.member ? props.member.last_name : "",
        picture: props.member ? props.member.picture : ""
      }
    };
  }
  next = (data: *) => {
    // we are editing a member, no need to register device again
    if (this.props.member) {
      // TODO modify member in store redux and call the API too
      const newMember = {
        ...this.props.member,
        email: data.email.value,
        first_name: data.first_name.value,
        last_name: data.last_name.value,
        picture: data.picture.value
      };
      const { setAlert } = this.props;
      const promise = this.props.editMember(newMember);
      // we have to return the promise so the dialogbutton will be able to be display in disable mode while pending
      promise
        .then(() => {
          this.props.close();
        })
        .catch(() => {
          setAlert("Error", "Oups something went wrong. Please retry", "error");
        });
      return promise;
    } else {
      this.setState({ step: 1, data: data });
    }
  };
  prev = () => {
    this.setState({ step: 0 });
  };

  finish = (result: *) => {
    this.setState({ step: 0 });
    this.props.finish(result);
  };

  render() {
    let label = "Continue";
    if (this.props.member) {
      label = "save";
    }

    const { step } = this.state;

    if (step === 0) {
      return (
        <EditProfile
          title="Add new member"
          profile={this.state.data}
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
