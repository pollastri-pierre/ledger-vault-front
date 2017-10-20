import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import ValidateBadge from '../../icons/ValidateBadge';
import Question from '../../icons/full/Question';
import { Avatar } from '../../../components';
import './AccountApproveApprovals.css';


class AccountApproveApprovals extends Component {
  componentWillMount() {
    const { approvers, isLoadingApprovers } = this.props.organization;

    if (!isLoadingApprovers && _.isNull(approvers)) {
      this.props.getOrganizationApprovers();
    }
  }

  render() {
    const { approvers, isLoadingApprovers } = this.props.organization;
    const { approved } = this.props.account;

    if (isLoadingApprovers || _.isNull(approvers)) {
      return (
        <CircularProgress
          style={{
            top: '50%',
            left: '50%',
            margin: '-25px 0 0 -25px',
          }}
        />
      );
    }

    const percentage = Math.round(100 * (approved.length / approvers.length));

    return (
      <div className="account-creation-members">
        <p className="info approve">
          The account will be available when the following members
          in yout team approve the creation request.
        </p>
        {_.map(approvers, (member) => {
          const isApproved = this.props.account.approved.indexOf(member.pub_key) > -1;
          return (
            <div
              key={member.id}
              className="account-member-approval"
            >
              <div className="member-avatar">
                {isApproved ?
                  <div className="badge-approved">
                    <ValidateBadge />
                  </div>
                  :
                  <div className="badge-approved not-approved">
                    <Question />
                  </div>
                }
                <Avatar
                  className="member-avatar-img"
                  url={member.picture}
                  width="13.5px"
                  height="15px"
                />
              </div>
              <span className="name">{member.firstname} {member.name}</span>
              {isApproved ?
                <p className="has-approved">Approved</p>
                :
                <p className="has-approved">Pending</p>
              }
            </div>
          );
        })}
        <div className="approval-percentage">
          <p>
            {approved.length} collected, {(approvers.length - approved.length)} remaining
            <span> ({percentage}%)</span>
          </p>

          <div className="percentage-bar">
            <div className="percentage-bar-fill" style={{ width: `${percentage}%` }} />
          </div>

        </div>
      </div>
    );
  }
}

AccountApproveApprovals.propTypes = {
  getOrganizationApprovers: PropTypes.func.isRequired,
  organization: PropTypes.shape({
    approvers: PropTypes.arrayOf(PropTypes.shape({})),
    isLoadingApprovers: PropTypes.bool,
  }).isRequired,
  account: PropTypes.shape({
    approved: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default AccountApproveApprovals;

