//@flow
import React from "react";
import PercentageBarProgress from "../PercentageBarProgress";
import type { Member, Approval } from "data/types";

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
      {approved.length} collected, {nbTotal - approved.length} remaining
      <span> ({100 * percentage}%)</span>
    </p>
  );

  return <PercentageBarProgress percentage={percentage} label={label} />;
}

export default ApprovalPercentage;
