// @flow

import memoize from "lodash/memoize";
import type { GroupCreationPayload } from "components/GroupCreationFlow/types";

export const hasMembersChanged: (
  GroupCreationPayload,
  GroupCreationPayload,
) => boolean = memoize(
  (payload: GroupCreationPayload, initialPayload: GroupCreationPayload) => {
    if (payload.members.length !== initialPayload.members.length) return true;
    return (
      initialPayload.members.filter(member =>
        payload.members.find(m => m.id === member.id),
      ).length !== initialPayload.members.length
    );
  },
);

export const hasEditOccured: (
  GroupCreationPayload,
  GroupCreationPayload,
) => boolean = memoize(
  (payload: GroupCreationPayload, initialPayload: GroupCreationPayload) =>
    hasMembersChanged(payload, initialPayload) ||
    payload.name !== initialPayload.name ||
    payload.description !== initialPayload.description,
);

export const onlyDescriptionChanged: (
  GroupCreationPayload,
  GroupCreationPayload,
) => boolean = memoize(
  (payload: GroupCreationPayload, initialPayload: GroupCreationPayload) =>
    !hasMembersChanged(payload, initialPayload) &&
    payload.name === initialPayload.name &&
    payload.description !== initialPayload.description,
);
