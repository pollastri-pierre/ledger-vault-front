// @flow

import type { Request, User } from "data/types";

export const hasUserApprovedRequest = (request: Request, me: User) =>
  request.approvals &&
  request.approvals.filter(
    approval =>
      approval.created_by.pub_key === me.pub_key && approval.type === "APPROVE",
  ).length > 0;
