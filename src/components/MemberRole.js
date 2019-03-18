// @flow
import { Component } from "react";
import type { User } from "data/types";

class MemberRole extends Component<{ member: User }> {
  render() {
    const { member } = this.props;
    return member.role || "Administrator";
  }
}

export default MemberRole;
