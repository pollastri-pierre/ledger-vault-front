// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import LineRow from "components/LineRow";
import CopyToClipboardButton from "components/CopyToClipboardButton";
import type { UserCreationStepProps } from "../types";

class UserCreationConfirmation extends PureComponent<UserCreationStepProps> {
  render() {
    const { payload } = this.props;
    const { username, userID, role, url } = payload;
    return (
      <Box>
        <LineRow
          label={
            <Trans i18nKey="inviteUser:steps.confirmation.rowTitle.username" />
          }
        >
          {username}
        </LineRow>
        <LineRow
          label={
            <Trans i18nKey="inviteUser:steps.confirmation.rowTitle.role" />
          }
        >
          {role}
        </LineRow>
        <LineRow
          label={
            <Trans i18nKey="inviteUser:steps.confirmation.rowTitle.userID" />
          }
        >
          {userID}
        </LineRow>
        <LineRow
          label={<Trans i18nKey="inviteUser:steps.confirmation.rowTitle.url" />}
        >
          <CopyToClipboardButton visible textToCopy={url || ""} />
        </LineRow>
      </Box>
    );
  }
}
export default UserCreationConfirmation;
