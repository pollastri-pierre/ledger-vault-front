//@flow
import { Component } from "react";
import type { Member } from "data/types";

class MemberRole extends Component<{ member: Member }> {
  render() {
    const { member } = this.props;
    return member.role || "Administrator";
  }
}

export default MemberRole;
