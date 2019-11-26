// @flow

import React from "react";

import MultiRules from "components/MultiRules";
import type { AccountCreationStepProps } from "../types";

export default (props: AccountCreationStepProps) => {
  const { payload, updatePayload, users, groups, whitelists } = props;
  const handleChangeRules = rulesSets => updatePayload({ rulesSets });
  const usersArray = users.edges.map(u => u.node);
  const groupsArray = groups.edges.map(g => g.node);

  const { currency, erc20token } = payload;

  const filteredWhitelistArray = whitelists.edges
    .map(w => w.node)
    .filter(w => {
      const currencyId = currency ? currency.id : "ethereum";
      return (
        w.status === "ACTIVE" &&
        w.addresses.find(a => {
          return a.currency === currencyId;
        })
      );
    });

  return (
    <MultiRules
      rulesSets={payload.rulesSets}
      onChange={handleChangeRules}
      users={usersArray}
      groups={groupsArray}
      whitelists={filteredWhitelistArray}
      // $FlowFixMe
      currencyOrToken={erc20token || currency}
    />
  );
};
