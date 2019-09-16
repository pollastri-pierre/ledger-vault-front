// @flow

import React from "react";
import { Trans } from "react-i18next";
import { FaUser, FaCheck } from "react-icons/fa";
import connectData from "restlay/connectData";
import colors from "shared/colors";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import { ModalFooterButton } from "components/base/Modal";

import type { PayloadUpdater } from "components/base/MultiStepsFlow/types";
import type { RestlayEnvironment } from "restlay/connectData";

import UserCreationRole from "./steps/UserCreationRole";
import UserCreationInfos, { isUserIDValid } from "./steps/UserCreationInfos";
import UserCreationConfirmation from "./steps/UserCreationConfirmation";
import { processUserInfo } from "./helpers";

import type { UserCreationPayload } from "./types";

const initialPayload: UserCreationPayload = {
  role: "",
  username: "",
  userID: "",
  url: "",
  request_id: null,
};

const onProcessUserInfo = (
  payload: UserCreationPayload,
  updatePayload: PayloadUpdater<UserCreationPayload>,
  restlay: RestlayEnvironment,
) => processUserInfo(payload, updatePayload, restlay.restlay);

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
      return !!payload.role;
    },
    onNext: onProcessUserInfo,
  },
  {
    id: "confirm",
    name: <Trans i18nKey="inviteUser:steps.confirmation.title" />,
    Step: UserCreationConfirmation,
    requirements: (payload: UserCreationPayload) => {
      return !!payload.username && isUserIDValid(payload.userID);
    },
    Cta: ({ onClose }: { onClose: () => void }) => {
      return (
        <ModalFooterButton color={colors.ocean} onClick={onClose}>
          <FaCheck style={{ marginRight: 10 }} />
          <Trans i18nKey="common:done" />
        </ModalFooterButton>
      );
    },
  },
];

const title = <Trans i18nKey="inviteUser:inviteLink" />;

function UserCreationFlow(props: { close: () => void }) {
  return (
    <MultiStepsFlow
      Icon={FaUser}
      title={title}
      initialPayload={initialPayload}
      steps={steps}
      onClose={props.close}
      additionalProps={props}
    />
  );
}

export default connectData(UserCreationFlow);
