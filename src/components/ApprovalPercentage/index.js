// @flow
import React from "react";
import type { Member, Approval } from "data/types";
import PercentageBarProgress from "../PercentageBarProgress";

function ApprovalPercentage(props: {
  approvers?: Member[],
  approved: Approval[],
  nbRequired?: number
}) {
  const { approved, approvers, nbRequired } = props;
  let nbTotal = 0;
  if (nbRequired) {
    nbTotal = nbRequired;
  } else if (approvers) {
    nbTotal = approvers.length;
  }

  const percentage = Math.round(100 * (approved.length / nbTotal)) / 100;

  const label = (
    <p>
      <span data-test="approvalpercentage-collected">{approved.length}</span>{" "}
      collected,{" "}
      <span data-test="approvalpercentage-total">
        {nbTotal - approved.length}
      </span>{" "}
      remaining
      <span> ({100 * percentage}%)</span>
    </p>
  );

  return <PercentageBarProgress percentage={percentage} label={label} />;
}

export default ApprovalPercentage;
