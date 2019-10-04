// @flow

import React from "react";

import MultiRules from "components/MultiRules";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload, updatePayload, users, groups } = props;
  const handleChangeRules = rulesSets => updatePayload({ rulesSets });

  const usersArray = users.edges.map(u => u.node);
  const groupsArray = groups.edges.map(g => g.node);

  return (
    <MultiRules
      rulesSets={payload.rulesSets}
      onChange={handleChangeRules}
      users={usersArray}
      groups={groupsArray}
    />
  );
};
