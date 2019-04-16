// @flow
import React from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import type { Match } from "react-router-dom";
import { createAndApprove } from "device/interactions/approveFlow";
import UsersQuery from "api/queries/UsersQuery";
import EditGroupDescriptionMutation from "api/mutations/EditGroupDescriptionMutation";
import GroupQuery from "api/queries/GroupQuery";

import ModalLoading from "components/ModalLoading";
import ApproveRequestButton from "components/ApproveRequestButton";
import UpdateDescriptionButton from "components/GroupCreationFlow/UpdateDescriptionButton";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import Text from "components/base/Text";
import { FaUsers } from "react-icons/fa";
import type { Group } from "data/types";

import GroupCreationInfos from "./GroupCreationInfos";
import GroupCreationMembers from "./GroupCreationMembers";
import GroupCreationConfirmation from "./GroupCreationConfirmation";
import { hasEditOccured, onlyDescriptionChanged } from "./utils";
import type { GroupCreationPayload } from "./types";

const styles = {
  container: { minHeight: 640 },
};
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
    id: "chooseMemgers",
    name: <Trans i18nKey="group:create.members" />,
    Step: GroupCreationMembers,
    requirements: (payload: GroupCreationPayload) => payload.description !== "",
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
    }: {
      payload: GroupCreationPayload,
      initialPayload: GroupCreationPayload,
      onClose: Function,
      isEditMode?: boolean,
    }) => {
      // if only description changed
      if (onlyDescriptionChanged(payload, initialPayload)) {
        return <UpdateDescriptionButton payload={payload} onClose={onClose} />;
      }
      const data = serializePayload(payload);

      return (
        <ApproveRequestButton
          interactions={
            payload.description !== initialPayload.description
              ? [editDescriptionMutation, ...createAndApprove]
              : createAndApprove
          }
          onSuccess={() => {
            onClose();
          }}
          disabled={!hasEditOccured(payload, initialPayload)}
          onError={null}
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

const RenderLoading = () => <ModalLoading height={640} width={700} />;
const Wrapper = ({ match, close }: { match: Match, close: Function }) => {
  if (match.params.groupId) {
    return <GroupEdit groupId={match.params.groupId} close={close} />;
  }
  return <GroupCreation close={close} />;
};

const GroupEdit = connectData(
  props => (
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
      style={styles.container}
      isEditMode
    />
  ),
  {
    RenderLoading,
    queries: {
      operators: UsersQuery,
      group: GroupQuery,
    },
    propsToQueryParams: props => ({
      role: "OPERATOR",
      groupId: props.groupId || "",
    }),
  },
);
const GroupCreation = connectData(
  props => (
    <MultiStepsFlow
      Icon={FaUsers}
      title={<Trans i18nKey="group:create.title" />}
      initialPayload={initialPayload}
      steps={steps}
      additionalProps={props}
      onClose={props.close}
      style={styles.container}
    />
  ),
  {
    RenderLoading,
    queries: {
      operators: UsersQuery,
    },
    propsToQueryParams: () => ({
      role: "OPERATOR",
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
