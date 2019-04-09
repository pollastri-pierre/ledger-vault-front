// @flow

import UpdateUserRegistrationMutation from "api/mutations/UpdateUserRegistrationMutation";
import InviteUserMutation from "api/mutations/InviteUserMutation";

import type { PayloadUpdater } from "components/base/MultiStepsFlow/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { UserCreationPayload } from "./types";

export const processUserInfo = async (
  payload: UserCreationPayload,
  updatePayload: PayloadUpdater<UserCreationPayload>,
  restlay: RestlayEnvironment,
) => {
  if (payload.request_id) {
    const request_id = payload.request_id || "";
    const user_info = {
      username: payload.username,
      user_id: payload.userID,
    };

    const mutation = new UpdateUserRegistrationMutation({
      request_id,
      user_info,
    });

    try {
      await restlay.commitMutation(mutation);
    } catch (error) {
      console.warn(error);
    }
  } else {
    const user = {
      type:
        payload.role === "Administrator" ? "CREATE_ADMIN" : "CREATE_OPERATOR",
      username: payload.username,
      user_id: payload.userID,
    };
    const query = new InviteUserMutation({
      user,
    });

    try {
      const data = await restlay.fetchQuery(query);
      const prefix = window.location.pathname.split("/")[1];
      const url = `${window.location.origin}/${prefix}/register/${data.url_id}`;
      updatePayload({ url, request_id: data.id });
    } catch (error) {
      // FIXME use internal error system to display banner etc.
      console.error(error);
    }
  }
};
