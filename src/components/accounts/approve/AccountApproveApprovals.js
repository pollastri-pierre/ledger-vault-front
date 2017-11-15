//@flow
import React, { Component } from "react";
import "./AccountApproveApprovals.css";
import InfoModal from "../../InfoModal";
import ApprovalList from "../../ApprovalList";
import type { Account, Member } from "../../../data/types";

type Props = {
  account: Account,
  approvers: Array<Member>
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

        <div style={{ marginTop: "40px" }}>
          <ApprovalList approvers={approvers} approved={approved} />
        </div>
      </div>
    );
  }
}

export default AccountApproveApprovals;
