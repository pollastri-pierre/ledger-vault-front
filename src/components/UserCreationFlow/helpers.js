// @flow

import UpdateUserRegistrationMutation from "api/mutations/UpdateUserRegistrationMutation";
import InviteUserMutation from "api/mutations/InviteUserMutation";

import type { PayloadUpdater } from "components/base/MultiStepsFlow/types";
import type { RestlayEnvironment } from "restlay/connectData";
import type { UserCreationPayload } from "./types";

export const updateUserInfo = async (
  request_id: string,
  user_info: Object,
  restlay: RestlayEnvironment,
) => {
  const mutation = new UpdateUserRegistrationMutation({
    request_id,
    user_info,
  });

  try {
    await restlay.commitMutation(mutation);
  } catch (error) {
    console.warn(error);
  }
};

export const processUserInfo = async (
  payload: UserCreationPayload,
  updatePayload?: PayloadUpdater<UserCreationPayload>,
  restlay: RestlayEnvironment,
) => {
  if (payload.request_id) {
    const user_info = {
      username: payload.username,
      user_id: payload.userID,
    };
    await updateUserInfo(payload.request_id, user_info, restlay);
  } else {
    const user = {
      type: payload.role === "ADMIN" ? "CREATE_ADMIN" : "CREATE_OPERATOR",
      username: payload.username,
      user_id: payload.userID,
    };
    const query = new InviteUserMutation({
      user,
    });

    const data = await restlay.fetchQuery(query);
    const prefix = window.location.pathname.split("/")[1];
    const url = `${window.location.origin}/${prefix}/register/${data.url_id}`;
    updatePayload && updatePayload({ url, request_id: data.id });
  }
};
