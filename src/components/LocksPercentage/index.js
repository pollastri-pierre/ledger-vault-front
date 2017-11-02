import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import PercentageBarProgress from "../PercentageBarProgress";

function LocksPercentage(props) {
  const { percentage } = props;

  let label;
  let percent = 0;

  if (_.isNull(percentage)) {
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

LocksPercentage.propTypes = {
  percentage: PropTypes.number.isRequired
};

export default LocksPercentage;
