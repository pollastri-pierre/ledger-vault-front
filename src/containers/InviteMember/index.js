// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import Box from "components/base/Box";
import { ModalHeader, ModalTitle, ModalBody } from "components/base/Modal";

type Props = {
  close: () => void,
  memberRole: string
};

class MemberDetails extends PureComponent<Props> {
  render() {
    const { close, memberRole } = this.props;

    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader>
          <ModalTitle>
            <Trans
              i18nKey="inviteMember:inviteLink"
              values={{
                memberRole
              }}
            />
          </ModalTitle>
        </ModalHeader>
        <Trans
          i18nKey="inviteMember:description"
          values={{
            memberRole
          }}
        />
        <Box>FINALIZING LAYOUT</Box>
      </ModalBody>
    );
  }
}

export default MemberDetails;
