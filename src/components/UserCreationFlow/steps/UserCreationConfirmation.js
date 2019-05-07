// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import LineRow from "components/LineRow";
import Copy from "components/base/Copy";
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
        {url && (
          <LineRow
            label={
              <Trans i18nKey="inviteUser:steps.confirmation.rowTitle.url" />
            }
          >
            <Copy text={url} />
          </LineRow>
        )}
      </Box>
    );
  }
}
export default UserCreationConfirmation;
