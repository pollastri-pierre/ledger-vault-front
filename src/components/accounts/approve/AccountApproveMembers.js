//@flow
import React, { Component } from "react";
import _ from "lodash";
import MemberRow from "../../MemberRow";
import InfoModal from "../../InfoModal";

type Props = {
  members: array,
  account: *
};
class AccountApproveMembers extends Component<Props> {
  render() {
    const { members } = this.props;
    const membersAccount = this.props.account.security_scheme.approvers;

    return (
      <div>
        <InfoModal>
          Members define the group of individuals that have the ability to
          approve outgoing operations from this account.
        </InfoModal>
        {_.map(membersAccount, hash => {
          const member = _.find(members, { pub_key: hash });
          return <MemberRow member={member} key={member.id} />;
        })}
      </div>
    );
  }
}

export default AccountApproveMembers;
