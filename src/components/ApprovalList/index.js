//@flow
import React from "react";
import ApprovalUser from "../ApprovalUser";
import ApprovalPercentage from "../ApprovalPercentage";
import type { Member } from "../../datatypes";

function ApprovalList(props: {
  approvers: Array<Member>,
  approved: Array<string>,
  nbRequired?: number
}) {
  const { approved, approvers, nbRequired } = props;
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

      <ApprovalPercentage
        approvers={approvers}
        approved={approved}
        nbRequired={nbRequired}
      />
    </div>
  );
}

export default ApprovalList;
