//@flow
import React from "react";
import MemberAvatar from "../MemberAvatar";
import ValidateBadge from "../icons/ValidateBadge";
import Question from "../icons/full/Question";
import type { Member } from "../../data/types";

function Approvalmember(props: { member: Member, isApproved: boolean }) {
  const { member, isApproved } = props;

  const name = member.first_name + " " + member.last_name;
  let slice;
  if (name.length > 10) {
    slice = name.slice(0, 10) + "...";
  } else {
    slice = name;
  }
  return (
    <div className="approval-member">
      <div className="wrapper-avatar-status">
        <MemberAvatar url={member.picture} />
        {isApproved ? (
          <ValidateBadge className="validated" />
        ) : (
          <Question className="pending" />
        )}
      </div>

      <span className="name">{slice}</span>
      {isApproved ? (
        <span className="has-approved">Approve</span>
      ) : (
        <span className="has-approved">Pending</span>
      )}
    </div>
  );
}

export default Approvalmember;
