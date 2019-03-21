// @flow
import React, { PureComponent } from "react";

import LineSeparator from "components/LineSeparator";
import { ModalHeader, ModalBody } from "components/base/Modal";
import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {};

class RegisterUserSuccess extends PureComponent<Props> {
  render() {
    return (
      <ModalBody>
        <ModalHeader>
          <Box horizontal align="center" flow={10}>
            <Text header bold i18nKey="inviteUser:registration.success.title" />
            <span role="img" aria-label="tada" aria-hidden="true">
              🎉
            </span>
          </Box>
          <Text bold i18nKey="inviteUser:registration.success.subtitle" />
        </ModalHeader>
        <LineSeparator />
        <Box flow={15} mt={15}>
          <Text i18nKey="inviteUser:registration.success.description" />
        </Box>
      </ModalBody>
    );
  }
}

export default RegisterUserSuccess;
