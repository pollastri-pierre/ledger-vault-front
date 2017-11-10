//@flow
import { Component } from "react";
import type { Member } from "../datatypes";

class MemberRole extends Component<{ member: Member }> {
  render() {
    const { member } = this.props;
    return member.role;
  }
}

export default MemberRole;
