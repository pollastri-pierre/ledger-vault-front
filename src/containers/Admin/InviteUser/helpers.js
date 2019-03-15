// @flow

import UpdateUserRegistrationMutation from "api/mutations/UpdateUserRegistrationMutation";
import type { RestlayEnvironment } from "restlay/connectData";

export const updateUserRegistrationInfo = async (
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
