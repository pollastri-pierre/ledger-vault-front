import React from 'react';
import PropTypes from 'prop-types';
import MemberAvatar from '../MemberAvatar';
import ValidateBadge from '../icons/ValidateBadge';
import Question from '../icons/full/Question';
import './index.css';

function Approvalmember(props) {
  const {member, isApproved} = props;

  const name = member.firstname + ' ' + member.name;
  let slice;
  if (name.length > 10) {
    slice = name.slice(0, 10) + '...';
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

Approvalmember.propTypes = {
  member: PropTypes.shape({}),
  isApproved: PropTypes.bool,
};

export default Approvalmember;
