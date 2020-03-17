// @flow
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import connectData from "restlay/connectData";
import { connect } from "react-redux";
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
import { resetRequest } from "redux/modules/requestReplayStore";
import type {
  EditGroupReplay,
  CreateGroupReplay,
} from "redux/modules/requestReplayStore";

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

const _initialPayload: GroupCreationPayload = {
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
      payloadToCompareTo,
    }: {
      payload: GroupCreationPayload,
      initialPayload: GroupCreationPayload,
      onClose: Function,
      isEditMode?: boolean,
      payloadToCompareTo: GroupCreationPayload,
      restlay: RestlayEnvironment,
      onSuccess: () => void,
    }) => {
      const { t } = useTranslation();
      // if only description changed
      if (
        onlyDescriptionChangedGeneric(payload, payloadToCompareTo, "members")
      ) {
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
          disabled={
            !hasEditOccuredGeneric(payload, payloadToCompareTo, "members")
          }
          additionalFields={{
            type: isEditMode ? "EDIT_GROUP" : "CREATE_GROUP",
            data,
            description: payload.description,
          }}
          buttonLabel={t(
            `group:create.${isEditMode ? "submit_edit" : "submit"}`,
          )}
        />
      );
    },
  },
  {
    id: "finish",
    name: <Trans i18nKey="group:create.finish" />,
    hideBack: true,
    Step: ({ isEditMode }: { isEditMode?: boolean }) => {
      const { t } = useTranslation();
      return (
        <MultiStepsSuccess
          title={t(
            isEditMode
              ? "group:update.finishTitle"
              : "group:create.finishTitle",
          )}
          desc={t(
            isEditMode ? "group:update.finishDesc" : "group:create.finishDesc",
          )}
        />
      );
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onClose}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
];

const mapStateToProps = state => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};
const Wrapper = connect(
  mapStateToProps,
  mapDispatch,
)(
  ({
    match,
    close,
    resetRequest,
    requestToReplay,
  }: {
    match: Match,
    close: Function,
    requestToReplay: EditGroupReplay | CreateGroupReplay,
    resetRequest: void => void,
  }) => {
    const closeAndEmptyStore = () => {
      resetRequest();
      close();
    };
    if (match.params.groupId) {
      return (
        <GroupEdit
          groupId={match.params.groupId}
          close={closeAndEmptyStore}
          requestToReplay={requestToReplay}
        />
      );
    }
    return (
      <GroupCreation
        close={closeAndEmptyStore}
        requestToReplay={requestToReplay}
      />
    );
  },
);

const GroupEdit = connectData(
  props => {
    const { t } = useTranslation();
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaUsers}
          title={
            <Text>
              {t("group:create.editTitle")}: {props.group.name}
            </Text>
          }
          initialPayload={mergeEditData(
            props.group,
            props.requestToReplay,
            props.operators.edges.map(e => e.node),
          )}
          payloadToCompareTo={props.group}
          steps={steps}
          additionalProps={{ ...props }}
          onClose={props.close}
          isEditMode
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    queries: {
      operators: UsersQuery,
      group: GroupQuery,
    },
    propsToQueryParams: props => ({
      role: "OPERATOR",
      status: ["ACTIVE"],
      groupId: props.groupId,
    }),
  },
);
const GroupCreation = connectData(
  props => {
    const { t } = useTranslation();
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaUsers}
          title={t("group:create.title")}
          initialPayload={
            (props.requestToReplay &&
              purgeCreatePayload(props.requestToReplay.entity)) ||
            _initialPayload
          }
          payloadToCompareTo={_initialPayload}
          steps={steps}
          additionalProps={props}
          onClose={props.close}
        />
      </GrowingCard>
    );
  },
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

function mergeEditData(
  group: Group,
  requestToReplay: EditGroupReplay,
  operators,
) {
  if (!requestToReplay || !requestToReplay.edit_data)
    return purgeEditPayload(group);

  const { edit_data } = requestToReplay;

  return {
    id: group.id,
    name: edit_data.name || group.name,
    description: group.description,
    members: edit_data.members
      ? edit_data.members
          .map(id => operators.find(o => o.id === id))
          .filter(Boolean)
      : group.members,
  };
}
// get rid of uneeded fields
function purgeEditPayload(group: Group) {
  return {
    id: group.id,
    ...purgeCreatePayload(group),
  };
}
function purgeCreatePayload(group: Group) {
  return {
    name: group.name,
    description: group.description || "",
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
