//@flow
import React from "react";
import ApprovalUser from "../ApprovalUser";
import type { Member } from "../../data/types";

function ApprovalList(props: {
  approvers: Array<Member>,
  approved: Array<string>
}) {
  const { approved, approvers } = props;
  return (
    <div>
      {approvers.map(member => {
        const isApproved = approved.indexOf(member.pub_key) > -1;

        return (
          <ApprovalUser
            key={member.pub_key}
            member={member}
            isApproved={isApproved}
          />
        );
      })}
    </div>
  );
}

export default ApprovalList;
