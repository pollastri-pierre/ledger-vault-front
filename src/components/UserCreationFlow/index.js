// @flow

import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FaUser } from "react-icons/fa";
import connectData from "restlay/connectData";

import { resetRequest } from "redux/modules/requestReplayStore";
import MultiStepsFlow from "components/base/MultiStepsFlow";
import Button from "components/base/Button";
import Box from "components/base/Box";
import Copy from "components/base/Copy";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";

import type { PayloadUpdater } from "components/base/MultiStepsFlow/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { User } from "data/types";
import type { CreateUserInvitationReplay } from "redux/modules/requestReplayStore";

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
    id: "recap",
    name: <Trans i18nKey="inviteUser:steps.recap.title" />,
    Step: UserCreationConfirmation,
    requirements: (payload: UserCreationPayload) => {
      return !!payload.username && isUserIDValid(payload.userID);
    },
    Cta: ({ onSuccess }: { onSuccess?: () => void }) => {
      const { t } = useTranslation();
      return (
        <Box my={10}>
          <Button type="filled" onClick={onSuccess}>
            {t("common:done")}
          </Button>
        </Box>
      );
    },
  },
  {
    id: "finish",
    name: <Trans i18nKey="inviteUser:steps.finish" />,
    hideBack: true,
    Step: ({ payload }: { payload: UserCreationPayload }) => {
      const { t } = useTranslation();
      return (
        <MultiStepsSuccess
          title={t("inviteUser:steps.finishTitle")}
          desc={t("inviteUser:steps.finishDesc")}
        >
          {payload && payload.url && (
            <Box style={{ maxWidth: 600 }}>
              <Copy text={payload.url} />
            </Box>
          )}
        </MultiStepsSuccess>
      );
    },
    Cta: ({ onClose }: { onClose?: () => void }) => {
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

const title = <Trans i18nKey="inviteUser:inviteLink" />;

function UserCreationFlow(props: {
  close: () => void,
  requestToReplay: ?CreateUserInvitationReplay,
}) {
  const { requestToReplay } = props;
  return (
    <MultiStepsFlow
      Icon={FaUser}
      title={title}
      initialPayload={
        requestToReplay ? purgePayload(requestToReplay.entity) : initialPayload
      }
      payloadToCompareTo={initialPayload}
      steps={steps}
      onClose={props.close}
      additionalProps={props}
    />
  );
}

function purgePayload(entity: User) {
  return {
    role: entity.role,
    userID: entity.user_id || "",
    username: entity.username,
    url: "",
    request_id: null,
  };
}

const mapStateToProps = state => ({
  requestToReplay: state.requestReplay,
});
const mapDispatch = {
  resetRequest,
};
export default connect(
  mapStateToProps,
  mapDispatch,
)(connectData(UserCreationFlow));
