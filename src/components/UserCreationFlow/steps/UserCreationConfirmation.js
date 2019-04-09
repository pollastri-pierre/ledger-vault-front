// @flow

import React, { PureComponent } from "react";

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
        <LineRow label="Username">{username}</LineRow>
        <LineRow label="Role">{role}</LineRow>
        <LineRow label="UserID">{userID}</LineRow>
        <LineRow label="Url">
          <CopyToClipboardButton visible textToCopy={url || ""} />
        </LineRow>
      </Box>
    );
  }
}
export default UserCreationConfirmation;
