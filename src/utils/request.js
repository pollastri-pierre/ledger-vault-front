// @flow

import type { Request, Member } from "data/types";

export const hasUserApprovedRequest = (request: Request, me: Member) =>
  request.approvals.filter(
    approval =>
      approval.created_by.pub_key === me.pub_key && approval.type === "APPROVE"
  ).length > 0;
