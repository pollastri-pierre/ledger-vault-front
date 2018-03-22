//@flow
import React from "react";
import PercentageBarProgress from "../PercentageBarProgress";
import type { Member, Approval } from "data/types";

function ApprovalPercentage(props: {
  approvers: Member[],
  approved: Approval[],
  nbRequired?: number
}) {
  const { approved, approvers, nbRequired } = props;
  const nbTotal =
    typeof nbRequired === "number" ? nbRequired : approvers.length;

  const percentage = approved.length / nbTotal;

  const label = (
    <p>
      {approved.length} collected, {nbTotal - approved.length} remaining
      <span> ({100 * percentage}%)</span>
    </p>
  );

  return <PercentageBarProgress percentage={percentage} label={label} />;
}

export default ApprovalPercentage;
