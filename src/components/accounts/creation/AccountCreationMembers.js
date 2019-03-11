// @flow
import React, { Component } from "react";
import ListApprovers from "components/accounts/ListApprovers";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  InternModalId
} from "redux/modules/account-creation";

class AccountCreationMembers extends Component<{
  switchInternalModal: Function,
  accountCreationState: AccountCreationState,
  switchInternalModal: InternModalId => void,
  updateAccountCreationState: UpdateAccountCreationState
}> {
  addApprover = (approver: string) => {
    const { updateAccountCreationState, accountCreationState } = this.props;

    const approvers = accountCreationState.approvers;
    const index = approvers.indexOf(approver);
    if (index > -1) {
      // we remove the approver from the array
      // we reset the quorum if number of approvers is inferior after the update
      updateAccountCreationState(state => ({
        approvers: [
          ...state.approvers.slice(0, index),
          ...state.approvers.slice(index + 1)
        ],
        quorum: state.approvers.length - 1 < state.quorum ? 0 : state.quorum
      }));
    } else {
      // we update the approvers
      updateAccountCreationState(state => ({
        approvers: [...state.approvers, approver]
      }));
    }
  };

  render() {
    const {
      switchInternalModal,
      accountCreationState: { approvers }
    } = this.props;

    return (
      <ListApprovers
        approvers={approvers}
        addApprover={this.addApprover}
        goBack={() => switchInternalModal("main")}
      />
    );
  }
}

export default AccountCreationMembers;
