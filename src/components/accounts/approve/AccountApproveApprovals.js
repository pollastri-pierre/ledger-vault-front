//@flow
import React, { Component } from "react";
import "./AccountApproveApprovals.css";
import InfoModal from "../../InfoModal";
import ApprovalList from "../../ApprovalList";

type Props = {
  account: *,
  approvers: array
};

class AccountApproveApprovals extends Component<Props> {
  render() {
    const { approved } = this.props.account;
    const { approvers } = this.props;

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

export default AccountApproveApprovals;
