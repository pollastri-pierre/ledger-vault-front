// @flow

import type {
  User,
  GenericRequest,
  GroupEditData,
  WhitelistEditData,
  AccountEditData,
} from "data/types";

// TODO: LOL
type GateHistory = {
  history: *,
};

export type VaultHistoryApproval = {
  type: "APPROVE" | "ABORT",
  createdOn: string,
  createdBy: User,
};

export type VaultHistoryApprovalStep = {
  quorum?: number,
  approvals: VaultHistoryApproval[],
};

type VaultHistoryStepType =
  | "CREATED"
  | "ACTIVED"
  | "BLOCKED"
  | "EXPIRED"
  | "APPROVED"
  | "ABORTED"
  | "REVOKED"
  | "EDITED"
  | "REGISTERED"
  | "SUBMITTED"
  | "INVITED"
  | "MIGRATION_FINISHED";

export type VaultHistoryStep = {
  type: VaultHistoryStepType,
  createdOn: string,
  createdBy: User,
  approvalsSteps?: Array<?VaultHistoryApprovalStep>,
  blockerRequest?: GenericRequest,
  edit_data?: GroupEditData | AccountEditData | WhitelistEditData,
};

export type VaultHistoryItem = {
  type: "CREATE" | "EDIT" | "DELETE",
  steps: VaultHistoryStep[],
  requestID: number,
};

export type VaultHistory = VaultHistoryItem[];

export function deserializeHistory(gateHistory: GateHistory): VaultHistory {
  // Gate is either sending history wrapped in an object, either an array
  const realHistory = gateHistory.history || gateHistory;
  return realHistory.map((gateStepsGroup) => {
    if (!gateStepsGroup.length) return null;
    return {
      type: resolveItemType(gateStepsGroup[0]),
      requestID: resolveRequestID(gateStepsGroup),
      steps: gateStepsGroup.map((gateStep) => {
        const step: $Exact<VaultHistoryStep> = {
          type: resolveStepType(gateStep),
          createdBy: gateStep.created_by,
          createdOn: gateStep.created_on,
        };
        if (gateStep.blocker_request) {
          step.blockerRequest = gateStep.blocker_request;
        }
        if (gateStep.edit_data) {
          step.edit_data = gateStep.edit_data;
        }
        if (gateStep.approvals_steps) {
          Object.assign(step, {
            approvalsSteps: gateStep.approvals_steps
              .map((approvalStep, index) => {
                if (!approvalStep) return null;
                return {
                  quorum: approvalStep.quorum,
                  approvals: gateStep.approvals
                    .filter((approval) => approval.step === index)
                    .map((approval) => ({
                      type: approval.type,
                      createdOn: approval.created_on,
                      createdBy: approval.created_by,
                    })),
                };
              })
              .filter(
                (approvalsStep) =>
                  !approvalsStep || approvalsStep.approvals.length > 0,
              ),
          });
        }

        return step;
      }),
    };
  });
}

function resolveRequestID(group) {
  const itemWithApprovals = group.find(
    (i) => i.approvals && i.approvals.length,
  );
  if (!itemWithApprovals) return null;
  const approval = itemWithApprovals.approvals[0];
  return approval.request_id;
}

function resolveItemType(item) {
  if (item.type.startsWith("REVOKE")) return "DELETE";
  if (item.type.startsWith("CREATE")) return "CREATE";
  if (item.type.startsWith("EDIT")) return "EDIT";
  return item.type;
}

function resolveStepType(item): VaultHistoryStepType {
  if (item.status === "BLOCKED") {
    return "BLOCKED";
  }
  if (item.status === "ACTIVE") {
    return "ACTIVED";
  }
  if (
    item.status === "PENDING_REGISTRATION" &&
    (item.type === "CREATE_OPERATOR" || item.type === "CREATE_ADMIN")
  ) {
    return "INVITED";
  }
  if (
    item.status === "PENDING_APPROVAL" &&
    (item.type === "CREATE_OPERATOR" || item.type === "CREATE_ADMIN")
  ) {
    return "REGISTERED";
  }
  if (item.type === "MIGRATE_ACCOUNT" && item.status === "ACTIVE") {
    return "MIGRATION_FINISHED";
  }
  if (
    item.status !== "APPROVED" &&
    item.status !== "ABORTED" &&
    item.status !== "EXPIRED" &&
    item.status !== "SUBMITTED"
  ) {
    // $FlowFixMe
    return findPreterit(item.type.split("_")[0]);
  }
  return item.status;
}

function findPreterit(str) {
  if (str.endsWith("E")) return `${str}D`;
  return `${str}ED`;
}
