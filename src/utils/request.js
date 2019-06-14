// @flow

import type { Request, User } from "data/types";

export const hasUserApprovedRequest = (request: Request, me: User) =>
  request.approvals &&
  request.approvals.filter(
    approval =>
      approval.created_by.pub_key === me.pub_key && approval.type === "APPROVE",
  ).length > 0;

export const hasUserApprovedCurrentStep = (request: Request, me: User) =>
  request.approvals &&
  request.approvals.filter(
    approval =>
      approval.created_by.pub_key === me.pub_key &&
      approval.type === "APPROVE" &&
      approval.step === request.current_step,
  ).length > 0;

export const isUserInCurrentStep = (request: Request, _me: User) => {
  try {
    const currentStep = request.approvals_steps[request.current_step];
    // TODO the day we want multi step approvals for admin, we will need
    // a smarter way to determine if `me` is in current step. for now
    // we assume if we got the step, the user is in it lol.
    return !!currentStep;
  } catch (err) {
    console.warn("Cant check if user is in current step", err);
    return false;
  }
};

export const isRequestPending = (request: Request) =>
  request.status !== "APPROVED" &&
  request.status !== "BLOCKED" &&
  request.status !== "ABORTED";
