//@flow
import React from "react";
import ApprovalUser from "../ApprovalUser";
import type { Member, Approval } from "data/types";

function ApprovalList(props: { approvers: Member[], approved: Approval[] }) {
  const { approved, approvers } = props;

  const list = approvers
    .map(member => {
      const data: Object = member;

      const isApproved = !!approved.find(
        approver => approver.person.pub_key === member.pub_key
      );
      data["approved"] = isApproved;
      return data;
    })
    .sort((a, b) => b.approved - a.approved);
  return (
    <div>
      {list.map(member => {
        return (
          <ApprovalUser
            key={member.pub_key}
            member={member}
            isApproved={member.approved}
          />
        );
      })}
    </div>
  );
}

export default ApprovalList;
