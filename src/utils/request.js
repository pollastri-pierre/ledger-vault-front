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

export const isUserInCurrentStep = (request: Request, me: User) => {
  try {
    if (!request || !request.approvals_steps) return false;
    const currentStep = request.approvals_steps[request.current_step];
    if (!currentStep) return false;
    return currentStep.group.members.some(m => m.id === me.id);
  } catch (err) {
    console.warn("Cant check if user is in current step", err);
    return false;
  }
};

export const isRequestPending = (request: Request) =>
  request.status !== "APPROVED" &&
  request.status !== "BLOCKED" &&
  request.status !== "ABORTED";
