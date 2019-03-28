// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaUser } from "react-icons/fa";

import MultiStepsFlow from "components/base/MultiStepsFlow";

import UserCreationRole from "./steps/UserCreationRole";
import UserCreationInfos from "./steps/UserCreationInfos";

import type { UserCreationPayload } from "./types";

const initialPayload: UserCreationPayload = {
  role: '',
  username: '',
  userID: '',
};

const steps = [
  {
    id: "role",
    name: <Trans i18nKey="inviteUser:steps.role.title" />,
    Step: UserCreationRole,
  },
  {
    id: "infos",
    name: <Trans i18nKey="inviteUser:steps.infos.title" />,
    Step: UserCreationInfos,
    requirements: (payload: UserCreationPayload) => {
      return !!payload.role
    },
  },
];

const title = <Trans i18nKey="inviteUser:inviteLink" />;

const styles = {
  container: { minHeight: 670 },
};

export default (props: { close: () => void }) => (
  <MultiStepsFlow
    Icon={FaUser}
    title={title}
    initialPayload={initialPayload}
    steps={steps}
    style={styles.container}
    onClose={props.close}
  />
);
