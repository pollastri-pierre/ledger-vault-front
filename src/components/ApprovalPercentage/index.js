import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import PercentageBarProgress from "../PercentageBarProgress";

function ApprovalPercentage(props) {
  const { approved, approvers, nbRequired } = props;
  const nbTotal = _.isNumber(nbRequired) ? nbRequired : approvers.length;

  const percentage = approved.length / nbTotal;

  const label = (
    <p>
      {approved.length} collected, {approvers.length - nbTotal} remaining
      <span> ({100 * percentage}%)</span>
    </p>
  );

  return <PercentageBarProgress percentage={percentage} label={label} />;
}

ApprovalPercentage.propTypes = {
  approvers: PropTypes.arrayOf(PropTypes.shape({})),
  approved: PropTypes.arrayOf(PropTypes.string),
  nbRequired: PropTypes.number
};

export default ApprovalPercentage;
