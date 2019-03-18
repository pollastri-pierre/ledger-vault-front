// @flow
import React from "react";
import type { User, Approval } from "data/types";

import Box from "components/base/Box";
import ApprovalUser from "../ApprovalUser";

function ApprovalList(props: { approvers: User[], approved: Approval[] }) {
  const { approved, approvers } = props;

  const list = approvers
    .map(member => {
      const data: Object = member;

      const isApproved = !!approved.find(
        approver => approver.person.pub_key === member.pub_key,
      );
      data.approved = isApproved;
      return data;
    })
    .sort((a, b) => b.approved - a.approved);

  return (
    <Box horizontal overflow="auto" flow={20} py={20}>
      {list.map(member => (
        <ApprovalUser
          key={member.pub_key}
          member={member}
          isApproved={member.approved}
        />
      ))}
    </Box>
  );
}

export default ApprovalList;
