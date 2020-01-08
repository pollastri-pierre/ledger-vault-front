// @flow
//
// dumb component, styling is parent responsability
import React from "react";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import { isMemberOfFirstApprovalStep } from "utils/users";

type Props = {
  account: Account,
};

const ApproverRole = (props: Props) => {
  const { account } = props;
  if (!account.governance_rules) return null;
  if (isMemberOfFirstApprovalStep(account)) {
    return <Trans i18nKey="approvalsRules:role_creator" />;
  }
  return <Trans i18nKey="approvalsRules:role_approver" />;
};

export default ApproverRole;
