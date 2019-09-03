// @flow
import React from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import type { Match } from "react-router-dom";
import { createAndApprove } from "device/interactions/hsmFlows";
import UsersQuery from "api/queries/UsersQuery";
import EditGroupDescriptionMutation from "api/mutations/EditGroupDescriptionMutation";
import GroupQuery from "api/queries/GroupQuery";

import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import ApproveRequestButton from "components/ApproveRequestButton";
import UpdateDescriptionButton from "components/GroupCreationFlow/UpdateDescriptionButton";
import { handleCancelOnDevice } from "utils/request";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import { FaUsers } from "react-icons/fa";
import type { Group } from "data/types";

import GroupCreationInfos from "./GroupCreationInfos";
import GroupCreationMembers from "./GroupCreationMembers";
import GroupCreationConfirmation from "./GroupCreationConfirmation";
import { hasEditOccured, onlyDescriptionChanged } from "./utils";
import type { GroupCreationPayload } from "./types";

const initialPayload: GroupCreationPayload = {
  name: "",
  description: "",
  members: [],
};

const steps = [
  {
    id: "infos",
    name: <Trans i18nKey="group:create.infos" />,
    Step: GroupCreationInfos,
  },
  {
    id: "chooseMembers",
    name: <Trans i18nKey="group:create.members" />,
    Step: GroupCreationMembers,
    requirements: (payload: GroupCreationPayload) => payload.name !== "",
  },
  {
    id: "confirm",
    name: <Trans i18nKey="group:create.confirmation" />,
    Step: GroupCreationConfirmation,
    requirements: (payload: GroupCreationPayload) => payload.members.length > 0,
    Cta: ({
      payload,
      onClose,
      isEditMode,
      initialPayload,
      restlay,
    }: {
      payload: GroupCreationPayload,
      initialPayload: GroupCreationPayload,
      onClose: Function,
      isEditMode?: boolean,
      restlay: RestlayEnvironment,
    }) => {
      // if only description changed
      if (onlyDescriptionChanged(payload, initialPayload)) {
        return <UpdateDescriptionButton payload={payload} onClose={onClose} />;
      }
      const data = serializePayload(payload);

      return (
        <ApproveRequestButton
          interactions={
            isEditMode && payload.description !== initialPayload.description
              ? [editDescriptionMutation, ...createAndApprove("GROUP")]
              : createAndApprove("GROUP")
          }
          onError={handleCancelOnDevice(restlay, onClose)}
          onSuccess={() => {
            onClose();
          }}
          disabled={!hasEditOccured(payload, initialPayload)}
          additionalFields={{
            type: isEditMode ? "EDIT_GROUP" : "CREATE_GROUP",
            data,
            description: payload.description,
          }}
          buttonLabel={
            <Trans
              i18nKey={`group:create.${isEditMode ? "submit_edit" : "submit"}`}
            />
          }
        />
      );
    },
  },
];

const Wrapper = ({ match, close }: { match: Match, close: Function }) => {
  if (match.params.groupId) {
    return <GroupEdit groupId={match.params.groupId} close={close} />;
  }
  return <GroupCreation close={close} />;
};

const GroupEdit = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaUsers}
        title={
          <Text>
            <Trans i18nKey="group:create.editTitle" />: {props.group.name}
          </Text>
        }
        initialPayload={purgePayload(props.group)}
        steps={steps}
        additionalProps={{ ...props }}
        onClose={props.close}
        isEditMode
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    queries: {
      operators: UsersQuery,
      group: GroupQuery,
    },
    propsToQueryParams: props => ({
      role: "OPERATOR",
      status: ["ACTIVE"],
      groupId: props.groupId || "",
    }),
  },
);
const GroupCreation = connectData(
  props => (
    <GrowingCard>
      <MultiStepsFlow
        Icon={FaUsers}
        title={<Trans i18nKey="group:create.title" />}
        initialPayload={initialPayload}
        steps={steps}
        additionalProps={props}
        onClose={props.close}
      />
    </GrowingCard>
  ),
  {
    RenderLoading: GrowingSpinner,
    queries: {
      operators: UsersQuery,
    },
    propsToQueryParams: () => ({
      role: "OPERATOR",
      status: ["ACTIVE"],
    }),
  },
);

export default Wrapper;

// get rid of uneeded fields
function purgePayload(group: Group) {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    members: group.members,
  };
}
function serializePayload(payload: GroupCreationPayload) {
  if (!payload.id)
    return {
      ...payload,
      members: payload.members.map(m => m.id),
      name: payload.name,
    };

  return {
    edit_data: {
      name: payload.name,
      members: payload.members.map(m => m.id),
    },
    group_id: payload.id,
  };
}

const editDescriptionMutation = {
  responseKey: "edit_description",
  action: ({ restlay, data, description }) =>
    restlay.commitMutation(
      new EditGroupDescriptionMutation({
        groupId: data.group_id,
        description,
      }),
    ),
};
