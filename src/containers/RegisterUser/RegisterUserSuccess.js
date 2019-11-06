// @flow
import React from "react";

import { ModalBody } from "components/base/Modal";
import Text from "components/base/Text";
import MultiStepsSuccess from "components/base/MultiStepsFlow/MultiStepsSuccess";

export default function RegisterUserSuccess() {
  return (
    <ModalBody width={550}>
      <MultiStepsSuccess
        title={
          <Text
            fontWeight="bold"
            i18nKey="inviteUser:registration.success.subtitle"
          />
        }
        desc={<Text i18nKey="inviteUser:registration.success.description" />}
      />
    </ModalBody>
  );
}
