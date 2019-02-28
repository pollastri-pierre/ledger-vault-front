// @flow
import { retry } from "network";
import type { Interaction } from "components/DeviceInteraction";
import { U2F_PATH } from "device";
import { getPublicKey } from "device/interface";

export const getU2FPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "u2f_key",
  action: ({ transport }) =>
    retry(() => getPublicKey()(transport, U2F_PATH, false))
};
