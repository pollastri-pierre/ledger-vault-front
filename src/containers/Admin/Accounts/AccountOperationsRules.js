// @flow
import React from "react";
import RulesViewer from "components/ApprovalsRules/RulesViewer";
import type { Account } from "data/types";

const AccountOperationsRules = ({ account }: { account: Account }) =>
  account.tx_approval_steps ? (
    <RulesViewer rules={account.tx_approval_steps} />
  ) : null;

export default AccountOperationsRules;
