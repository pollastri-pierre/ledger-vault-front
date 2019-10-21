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
import { FaUsers } from "react-icons/fa";

import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";
import ApproveRequestButton from "components/ApproveRequestButton";
import UpdateDescriptionButton from "components/GroupCreationFlow/UpdateDescriptionButton";
import { handleCancelOnDevice } from "utils/request";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import Button from "components/base/Button";
import Box from "components/base/Box";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";

import type { Group } from "data/types";

import {
  hasEditOccuredGeneric,
  onlyDescriptionChangedGeneric,
} from "utils/creationFlows";
import GroupCreationInfos from "./GroupCreationInfos";
import GroupCreationConfirmation from "./GroupCreationConfirmation";
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
    id: "confirm",
    name: <Trans i18nKey="group:create.confirmation" />,
    Step: GroupCreationConfirmation,
    requirements: (payload: GroupCreationPayload) =>
      payload.name !== "" && payload.members.length > 0,
    Cta: ({
      payload,
      onClose,
      isEditMode,
      initialPayload,
      restlay,
      onSuccess,
    }: {
      payload: GroupCreationPayload,
      initialPayload: GroupCreationPayload,
      onClose: Function,
      isEditMode?: boolean,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
    }) => {
      // if only description changed
      if (onlyDescriptionChangedGeneric(payload, initialPayload, "members")) {
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
            onSuccess();
          }}
          disabled={!hasEditOccuredGeneric(payload, initialPayload, "members")}
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
  {
    id: "finish",
    name: <Trans i18nKey="group:create.finish" />,
    hideBack: true,
    Step: ({ isEditMode }: { isEditMode?: boolean }) => {
      return (
        <MultiStepsSuccess
          title={
            isEditMode ? (
              <Trans i18nKey="group:update.finishTitle" />
            ) : (
              <Trans i18nKey="group:create.finishTitle" />
            )
          }
          desc={
            isEditMode ? (
              <Trans i18nKey="group:update.finishDesc" />
            ) : (
              <Trans i18nKey="group:create.finishDesc" />
            )
          }
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            <Trans i18nKey="common:done" />
          </Button>
        </Box>
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
