// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";

import Box from "components/base/Box";
import UserRoleFormatter from "components/UserRoleFormatter";
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
          label={<Trans i18nKey="inviteUser:steps.recap.rowTitle.username" />}
        >
          {username}
        </LineRow>
        <LineRow
          label={<Trans i18nKey="inviteUser:steps.recap.rowTitle.role" />}
        >
          <UserRoleFormatter userRole={role} />
        </LineRow>
        <LineRow
          label={<Trans i18nKey="inviteUser:steps.recap.rowTitle.userID" />}
        >
          {userID.toUpperCase()}
        </LineRow>
        {url && (
          <LineRow
            label={<Trans i18nKey="inviteUser:steps.recap.rowTitle.url" />}
          >
            <Copy text={url} />
          </LineRow>
        )}
      </Box>
    );
  }
}
export default UserCreationConfirmation;
