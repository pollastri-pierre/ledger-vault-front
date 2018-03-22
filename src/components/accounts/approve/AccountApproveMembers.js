//@flow
import React, { Component } from "react";
import { Overscroll } from "../../";
import MemberRow from "../../MemberRow";
import InfoModal from "../../InfoModal";
import type { Member } from "data/types";

type Props = {
  members: Array<Member>
};
class AccountApproveMembers extends Component<Props> {
  render() {
    const { members } = this.props;
    return (
      <div>
        <InfoModal>
          Members define the group of individuals that have the ability to
          approve outgoing operations from this account.
        </InfoModal>
        <div style={{ marginTop: "40px", height: 300 }}>
          <Overscroll top={20} bottom={80}>
            {members.map(member => {
              return <MemberRow member={member} key={member.id} />;
            })}
          </Overscroll>
        </div>
      </div>
    );
  }
}

export default AccountApproveMembers;
