//@flow
import React, { Component } from "react";
import find from "lodash/find";
import MemberRow from "../../MemberRow";
import InfoModal from "../../InfoModal";
import type { Member, Account } from "../../../data/types";

type Props = {
  members: Array<Member>,
  account: Account
};
class AccountApproveMembers extends Component<Props> {
  render() {
    const { members, account } = this.props;
    return (
      <div>
        <InfoModal>
          Members define the group of individuals that have the ability to
          approve outgoing operations from this account.
        </InfoModal>
        <div style={{ marginTop: "40px" }}>
          {account.security_scheme.approvers.map(hash => {
            const member = find(members, { pub_key: hash });
            if (!member) return null;
            return <MemberRow member={member} key={member.id} />;
          })}
        </div>
      </div>
    );
  }
}

export default AccountApproveMembers;
