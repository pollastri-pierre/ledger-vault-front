//@flow
import React, { Component } from "react";
import InfoModal from "../../InfoModal";
import ApprovalList from "../../ApprovalList";
import type { Member, Approval } from "data/types";
import { Overscroll } from "../../";

type Props = {
  members: Member[],
  approvers: Approval[]
};

class AccountApproveApprovals extends Component<Props> {
  render() {
    const { members, approvers } = this.props;

    return (
      <div>
        <InfoModal>
          The account will be available when the following members in your team
          approve the creation request.
        </InfoModal>

        <div style={{ marginTop: "40px", height: 200 }}>
          <Overscroll top={20} bottom={100}>
            <ApprovalList approvers={members} approved={approvers || []} />
          </Overscroll>
        </div>
      </div>
    );
  }
}

export default AccountApproveApprovals;
