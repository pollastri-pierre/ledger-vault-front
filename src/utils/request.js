// @flow

import type { MemoryHistory } from "history";

import type { Request, User, RequestActivityType } from "data/types";

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

export const getModalTabLink = (request: ?Request, url: string) => {
  const defaultLink = `${url}/overview`;
  if (!request) return defaultLink;
  return isRequestPending(request) && isEditRequest(request)
    ? `${url}/editRequest`
    : defaultLink;
};

export const isRequestPending = (request: Request) =>
  request.status !== "APPROVED" &&
  request.status !== "BLOCKED" &&
  request.status !== "ABORTED";

const EDIT_REQUEST_TYPE: RequestActivityType[] = [
  "EDIT_ACCOUNT",
  "EDIT_GROUP",
  "MIGRATE_ACCOUNT",
];

export const isEditRequest = (request: Request) =>
  EDIT_REQUEST_TYPE.indexOf(request.type) > -1;

export function isNotTransaction(request: Request) {
  return request.type !== "CREATE_TRANSACTION";
}

export function navigateToRequest(request: Request, history: MemoryHistory) {
  if (request.target_type === "GROUP") {
    history.push(
      getModalTabLink(request, `dashboard/groups/details/${request.target_id}`),
    );
  } else if (request.target_type === "PERSON") {
    history.push(
      getModalTabLink(request, `dashboard/users/details/${request.target_id}`),
    );
  } else if (
    request.target_type === "BITCOIN_ACCOUNT" ||
    request.target_type === "ERC20_ACCOUNT" ||
    request.target_type === "ETHEREUM_ACCOUNT"
  ) {
    history.push(
      getModalTabLink(
        request,
        `dashboard/accounts/details/${request.target_id}`,
      ),
    );
  } else if (
    request.target_type === "BITCOIN_LIKE_TRANSACTION" ||
    request.target_type === "ETHEREUM_LIKE_TRANSACTION"
  ) {
    history.push(
      getModalTabLink(
        request,
        `dashboard/transactions/details/${request.target_id}`,
      ),
    );
  } else if (request.target_type === "ORGANIZATION") {
    history.push(`dashboard/organization/details/${request.id}`);
  }
}

// FIXME REVOKE_USER is also triggered when revoking an operator which does not affect admin rules
const ACTION_AFFECTING_ADMIN_RULES = [
  "REVOKE_USER",
  "CREATE_ADMIN",
  "UPDATE_QUORUM",
];
export function isRequestAffectingAdminRules(request: Request) {
  return ACTION_AFFECTING_ADMIN_RULES.includes(request.type);
}

export function getCurrentStepProgress(request: Request) {
  if (!request) return null;
  if (!request.approvals_steps) return null;
  const step = request.approvals_steps[request.current_step];
  if (!step) return null;
  const nbApproved = (request.approvals || []).filter(
    a => a.step === request.current_step,
  ).length;
  return { nb: nbApproved, total: step.quorum };
}
