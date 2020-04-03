// @flow
//
// dumb component, styling is parent responsability
import { useTranslation } from "react-i18next";

import type { Account } from "data/types";
import { isMemberOfFirstApprovalStep } from "utils/users";

type Props = {
  account: Account,
};

const ApproverRole = (props: Props) => {
  const { account } = props;
  const { t } = useTranslation();
  if (!account.governance_rules) return null;
  if (isMemberOfFirstApprovalStep(account)) {
    return t("approvalsRules:role_creator");
  }
  return t("approvalsRules:role_approver");
};

export default ApproverRole;
