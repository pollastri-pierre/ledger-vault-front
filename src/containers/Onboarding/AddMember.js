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
  challenge: string,
  registerKeyHandle: Function
};
type State = {
  step: number,
  data: *
};

class AddMember extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { step: 0, data: {} };
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
    const data = {};
    ["first_name", "last_name", "email", "picture"].forEach(key => {
      const value = this.state.data[key].value;
      data[key] = value;
    });
    data["role"] = "Administrator";
    data["pub_key"] = result.pub_key;
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
          registerKeyHandle={this.props.registerKeyHandle}
          cancel={this.prev}
          data={this.state.data}
          challenge={this.props.challenge}
        />
      );
    }
  }
}

export default AddMember;
