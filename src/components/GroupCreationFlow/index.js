// @flow
import React from "react";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import { createAndApprove } from "device/interactions/approveFlow";
import UsersQuery from "api/queries/UsersQuery";

import ModalLoading from "components/ModalLoading";
import ApproveRequestButton from "components/ApproveRequestButton";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import { FaUsers } from "react-icons/fa";

import GroupCreationName from "./GroupCreationName";
import GroupCreationDescription from "./GroupCreationDescription";
import GroupCreationMembers from "./GroupCreationMembers";
import GroupCreationConfirmation from "./GroupCreationConfirmation";
import type { GroupCreationPayload } from "./types";

const styles = {
  container: { minHeight: 500 },
};
const initialPayload: GroupCreationPayload = {
  name: "",
  description: "",
  members: [],
};

const steps = [
  {
    id: "chooseName",
    name: <Trans i18nKey="group:create.name" />,
    Step: GroupCreationName,
  },
  {
    id: "chooseDescription",
    name: <Trans i18nKey="group:create.description" />,
    Step: GroupCreationDescription,
    requirements: (payload: GroupCreationPayload) => payload.name !== "",
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
    }: {
      payload: GroupCreationPayload,
      onClose: Function,
    }) => {
      const data = serializePayload(payload);
      return (
        <ApproveRequestButton
          interactions={createAndApprove}
          onSuccess={() => {
            onClose();
          }}
          disabled={false}
          onError={null}
          additionalFields={{ type: "CREATE_GROUP", data }}
          buttonLabel={<Trans i18nKey="group:create.submit" />}
        />
      );
    },
  },
];

const RenderLoading = () => <ModalLoading height={500} width={700} />;
export default connectData(
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
    initialVariables: {
      // TODO remove this when endpoint is not paginated anymore
      operators: 30,
    },
    propsToQueryParams: () => ({
      role: "OPERATOR",
    }),
  },
);

function serializePayload(payload: GroupCreationPayload) {
  return { ...payload, members: payload.members.map(m => m.id) };
}
