// @flow

import React from "react";

import ApprovalsRules from "components/ApprovalsRules";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload, updatePayload, users, groups } = props;
  const handleChangeRules = rules => updatePayload({ rules });
  return (
    <ApprovalsRules
      rules={payload.rules}
      onChange={handleChangeRules}
      users={users.edges.map(u => u.node)}
      groups={groups.edges.map(g => g.node)}
    />
  );
};
