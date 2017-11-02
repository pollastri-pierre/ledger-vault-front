import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import CircularProgress from "material-ui/CircularProgress";
import ValidateBadge from "../../icons/ValidateBadge";
import Question from "../../icons/full/Question";
import { Avatar } from "../../../components";
import "./AccountApproveApprovals.css";
import InfoModal from "../../InfoModal";
import ApprovalList from "../../ApprovalList";

class AccountApproveApprovals extends Component {
  render() {
    const { approved } = this.props.account;
    const { approvers } = this.props;

    console.log(approvers);
    console.log(approved);

    return (
      <div className="account-creation-members">
        <InfoModal>
          The account will be available when the following members in your team
          approve the creation request.
        </InfoModal>

        <ApprovalList approvers={approvers} approved={approved} />
      </div>
    );
  }
}

AccountApproveApprovals.propTypes = {
  getOrganizationApprovers: PropTypes.func.isRequired,
  organization: PropTypes.shape({
    approvers: PropTypes.arrayOf(PropTypes.shape({})),
    isLoadingApprovers: PropTypes.bool
  }).isRequired,
  account: PropTypes.shape({
    approved: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default AccountApproveApprovals;
