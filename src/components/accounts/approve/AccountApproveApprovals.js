import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import ValidateBadge from '../../icons/ValidateBadge';
import Question from '../../icons/full/Question';
import {Avatar} from '../../../components';
import './AccountApproveApprovals.css';
import ApprovalList from '../../ApprovalList';

class AccountApproveApprovals extends Component {
  componentWillMount() {
    const {approvers, isLoadingApprovers} = this.props.organization;

    if (!isLoadingApprovers && _.isNull(approvers)) {
      this.props.getOrganizationApprovers();
    }
  }

  render() {
    const {approvers, isLoadingApprovers} = this.props.organization;
    const {approved} = this.props.account;

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

    console.log(approvers);

    return (
      <div className="account-creation-members">
        <p className="info approve">
          The account will be available when the following members in yout team
          approve the creation request.
        </p>
        <ApprovalList approvers={approvers} approved={approved} />
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
