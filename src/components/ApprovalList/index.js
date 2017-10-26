import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ApprovalUser from '../ApprovalUser';
import ApprovalPercentage from '../ApprovalPercentage';

function ApprovalList(props) {
  const {approved, approvers, nbRequired} = props;

  return (
    <div>
      {_.map(approvers, member => {
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

ApprovalList.propTypes = {
  approvers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  approved: PropTypes.arrayOf(PropTypes.string).isRequired,
  nbRequired: PropTypes.number,
};

export default ApprovalList;
