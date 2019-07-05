// @flow

import type { Entity } from "data/types";
import { isEditRequest } from "utils/request";

// FIXME added 'ACTIVE' because I saw ACTIVE status
// for an account, don't know if it's only for account or not.
const STATUS_NOT_PENDING = [
  "ACTIVE",
  "APPROVED",
  "SUBMITTED",
  "ABORTED",
  "BLOCKED",
];

export const hasPendingRequest = (entity: Entity) =>
  !!entity.last_request &&
  STATUS_NOT_PENDING.indexOf(entity.last_request.status) === -1;

export const hasPendingEdit = (entity: Entity) =>
  !!entity.last_request &&
  hasPendingRequest(entity) &&
  isEditRequest(entity.last_request);
