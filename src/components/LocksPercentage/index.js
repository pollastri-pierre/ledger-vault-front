//@flow
import React from "react";
import PercentageBarProgress from "../PercentageBarProgress";

type Props = {
  percentage?: number
};

function LocksPercentage(props: Props) {
  const { percentage } = props;

  let label;
  let percent = 0;

  if (typeof percentage !== "number") {
    label = <p>waiting for members approvals...</p>;
  } else {
    percent = percentage;
    label = (
      <p>
        waiting for completion
        <span> ({Math.round(100 * percentage)}%)</span>
      </p>
    );
  }

  return (
    <div className="approval-percentage">
      <PercentageBarProgress percentage={percent} label={label} />
    </div>
  );
}

export default LocksPercentage;
