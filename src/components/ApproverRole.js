// @flow
//
// dumb component, styling is parent responsability
import React from "react";
import { Trans } from "react-i18next";
import { useMe } from "components/UserContextProvider";

import type { Account, TxApprovalStepCollection, User } from "data/types";

type Props = {
  account: Account,
};

const ApproverRole = (props: Props) => {
  const { account } = props;
  const me = useMe();
  if (!account.tx_approval_steps) return null;
  if (isInFirstStep(account.tx_approval_steps, me)) {
    return <Trans i18nKey="approvalsRules:role_creator" />;
  }
  return <Trans i18nKey="approvalsRules:role_approver" />;
};

export default ApproverRole;

function isInFirstStep(
  tx_approval_steps: TxApprovalStepCollection,
  user: User,
) {
  const firstStep = tx_approval_steps[0];
  if (!firstStep) return false;
  return firstStep.group.members.some(m => m.id === user.id);
}
