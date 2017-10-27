import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import PercentageBarProgress from '../PercentageBarProgress';
import './index.css';

function ApprovalPercentage(props) {
  const { approved, approvers, nbRequired } = props;
  const nbTotal = _.isNumber(nbRequired) ? nbRequired : approvers.length;

  const percentage = Math.round(100 * (approved.length / nbTotal));

  return (
    <div className="approval-percentage">
      <p>
        {approved.length} collected, {approvers.length - nbTotal} remaining
        <span> ({percentage}%)</span>
      </p>

      <PercentageBarProgress percentage={percentage} />
    </div>
  );
}

ApprovalPercentage.propTypes = {
  approvers: PropTypes.arrayOf(PropTypes.shape({})),
  approved: PropTypes.arrayOf(PropTypes.string),
  nbRequired: PropTypes.number,
};

export default ApprovalPercentage;
