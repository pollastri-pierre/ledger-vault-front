//@flow
import React, { Component } from "react";
import EditProfile from "components/EditProfile";
import RegisterAdmins from "./RegisterAdmins.js";
import type { Member } from "data/types";

const steps = [
  "Switch on the Ledger Blue Enterprise and connect it to your computer using the provided USB cable.",
  "Enter your PIN code to unlock the device.",
  "Open the Vault app from the Ledger Blue Enterprise dashboard and tap 'Confirm' when prompted."
];
type Props = {
  close: Function,
  finish: Function,
  setAlert: Function,
  editMember: Function,
  history: *,
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
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        picture: data.picture
      };
      const { setAlert } = this.props;
      const promise = this.props.editMember(newMember);
      // we have to return the promise so the dialogbutton will be able to be display in disable mode while pending
      promise
        .then(() => {
          this.props.close();
        })
        .catch(() => {
          setAlert(
            "Error",
            "Oops something went wrong. Please try again",
            "error"
          );
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
    const data = {
      first_name: this.state.data.first_name,
      last_name: this.state.data.last_name,
      email: this.state.data.email,
      picture: this.state.data.picture
    };
    this.props.finish({ ...result, ...data });
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
        <RegisterAdmins
          steps={steps}
          title="Register device"
          close={this.props.close}
          history={this.props.history}
          finish={this.finish}
          cancel={this.prev}
          challenge={this.props.challenge}
        />
      );
    }
  }
}

export default AddMember;
