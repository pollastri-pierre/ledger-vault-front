// @flow

import type { Account } from "data/types";

// operators receive Null as a step if he is not part of it
export const isMemberOfFirstApprovalStep = (account: Account) =>
  account.tx_approval_steps && !account.tx_approval_steps[0];
