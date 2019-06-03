// @flow

import type { Account, User } from "data/types";

export const isMemberOfFirstApprovalStep = (account: Account, me: User) =>
  account.tx_approval_steps &&
  account.tx_approval_steps[0].group.members.findIndex(m => m.id === me.id) >
    -1;
