// @flow
import React, { Component } from "react";
import type { Member, Approval } from "data/types";
import ApprovalList from "../../ApprovalList";
import { Overscroll } from "../..";

type Props = {
  members: Member[],
  approvers: Approval[]
};

class AccountApproveApprovals extends Component<Props> {
  render() {
    const { members, approvers } = this.props;

    return (
      <div>
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
