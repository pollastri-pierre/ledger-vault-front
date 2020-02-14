// @flow
import React, { PureComponent } from "react";
import type { User } from "data/types";
import connectData from "restlay/connectData";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import EditableField from "components/EditableField";
import Box from "components/base/Box";
import Copy from "components/base/Copy";
import {
  InputUserID,
  isUserIDValid,
} from "components/UserCreationFlow/steps/UserCreationInfos";
import UserRoleFormatter from "components/UserRoleFormatter";

import { updateUserInfo } from "components/UserCreationFlow/helpers";

import type { RestlayEnvironment } from "restlay/connectData";

type Props = {
  user: User,
  restlay: RestlayEnvironment,
};

const inputPropsUsername = {
  maxLength: 19,
  onlyAscii: true,
};

class UserDetailsOverview extends PureComponent<Props> {
  updateUserInfo = async (user_info: Object) => {
    const { user, restlay } = this.props;
    user.last_request &&
      (await updateUserInfo(
        user.last_request.id.toString(),
        user_info,
        restlay,
        user.id,
      ));
  };

  updateUsername = (username: string) => {
    return this.updateUserInfo({ username });
  };

  updateUserID = (user_id: string) => {
    return this.updateUserInfo({ user_id });
  };

  render() {
    const { user } = this.props;
    const isPendingRegistration = !!(
      user.last_request && user.last_request.status === "PENDING_REGISTRATION"
    );
    const prefix = window.location.pathname.split("/")[1];
    const url =
      user.last_request && user.last_request.url_id
        ? `${window.location.origin}/${prefix}/register/${user.last_request.url_id}`
        : null;

    return (
      <Box>
        <LineRow label={<Trans i18nKey="userDetails:username" />}>
          {isPendingRegistration ? (
            <EditableField
              value={user.username}
              onChange={this.updateUsername}
              inputProps={inputPropsUsername}
            />
          ) : (
            user.username
          )}
        </LineRow>

        <LineRow label={<Trans i18nKey="userDetails:role" />}>
          <UserRoleFormatter userRole={user.role} />
        </LineRow>
        <LineRow
          label={<Trans i18nKey="userDetails:userID" />}
          noOverflowHidden
        >
          {isPendingRegistration ? (
            <EditableField
              value={(user.user_id && user.user_id.toUpperCase()) || ""}
              onChange={this.updateUserID}
              InputComponent={InputUserID}
              inputProps={{ width: 300 }}
              getSaveDisabled={v => !isUserIDValid(v)}
            />
          ) : (
            user.user_id && user.user_id.toUpperCase()
          )}
        </LineRow>
        {url && (
          <LineRow label={<Trans i18nKey="userDetails:url" />}>
            {url && <Copy text={url} />}
          </LineRow>
        )}
      </Box>
    );
  }
}

export default connectData(UserDetailsOverview);
