// @flow
import React, { Component } from "react";

import type { Member } from "data/types";
import Box from "components/base/Box";
import MemberRow from "../../MemberRow";

type Props = {
  members: Member[]
};

class AccountApproveMembers extends Component<Props> {
  render() {
    const { members } = this.props;
    return (
      <Box grow overflow="scroll">
        {members.map(member => <MemberRow member={member} key={member.id} />)}
      </Box>
    );
  }
}

export default AccountApproveMembers;
