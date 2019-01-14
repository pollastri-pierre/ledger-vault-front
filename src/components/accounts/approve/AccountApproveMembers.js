// @flow
import React, { Component } from "react";
import type { Member } from "data/types";
import { Overscroll } from "../..";
import MemberRow from "../../MemberRow";

type Props = {
  members: Array<Member>
};
class AccountApproveMembers extends Component<Props> {
  render() {
    const { members } = this.props;
    return (
      <div>
        <div style={{ marginTop: "40px", height: 300 }}>
          <Overscroll top={20} bottom={80}>
            {members.map(member => (
              <MemberRow member={member} key={member.id} />
            ))}
          </Overscroll>
        </div>
      </div>
    );
  }
}

export default AccountApproveMembers;
