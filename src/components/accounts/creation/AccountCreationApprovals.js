// @flow
import React, { Component } from "react";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  InternModalId
} from "redux/modules/account-creation";

import SetApprovals from "components/accounts/SetApproval";

type Props = {
  switchInternalModal: InternModalId => void,
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState
};

class AccountCreationApprovals extends Component<Props> {
  setQuorum = (nb: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ quorum: parseInt(nb, 10) || 0 }));
  };

  render() {
    const {
      accountCreationState: { approvers, quorum },
      switchInternalModal
    } = this.props;
    return (
      <SetApprovals
        approvers={approvers}
        quorum={quorum}
        goBack={() => switchInternalModal("main")}
        setQuorum={this.setQuorum}
      />
    );
  }
}

export default AccountCreationApprovals;
