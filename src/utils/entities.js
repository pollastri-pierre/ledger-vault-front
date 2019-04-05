// @flow

import type { Entity } from "data/types";

export const hasPendingRequest = (entity: Entity) =>
  !!entity.last_request &&
  (entity.last_request.status !== "APPROVED" &&
    entity.last_request.status !== "ABORTED");

export const hasPendingEdit = (entity: Entity) =>
  !!entity.last_request &&
  hasPendingRequest(entity) &&
  entity.last_request.type === `EDIT_${entity.last_request.target_type}`;
