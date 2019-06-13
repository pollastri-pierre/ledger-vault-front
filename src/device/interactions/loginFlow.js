// @flow
import { StatusCodes } from "@ledgerhq/hw-transport";
import network, { retryOnCondition } from "network";
import { APPID_VAULT_ADMINISTRATOR } from "device";
import { authenticate } from "device/interface";
import type { Interaction } from "components/DeviceInteraction";
import type { Organization } from "data/types";
import type { DeviceError } from "utils/errors";
import { getU2FPublicKey } from "device/interactions/common";

type Flow = Interaction[];

export const getU2FChallenge: Interaction = {
  needsUserInput: false,
  responseKey: "u2f_challenge",
  action: ({ u2f_key: { pubKey }, organization }) =>
    network(
      `${organization.workspace}/u2f/authentications/${pubKey}/challenge`,
      "GET",
    ),
};

export const u2fAuthenticate: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "u2f_authenticate",
  action: ({
    transport,
    u2f_challenge: { token, key_handle, role, name, u2f_register_data },
  }) =>
    retryOnCondition(
      () =>
        authenticate()(
          transport,
          Buffer.from(token, "base64"),
          APPID_VAULT_ADMINISTRATOR,
          Buffer.from(key_handle, "hex"),
          name,
          role,
          u2f_register_data,
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    ),
};

export const postU2FSignature: Interaction = {
  responseKey: "u2f_sign",
  action: ({ u2f_authenticate, organization, u2f_challenge: { token } }) =>
    network(
      `${organization.workspace}/u2f/authentications/authenticate`,
      "POST",
      {
        authentication: u2f_authenticate.rawResponse,
      },
      token,
    ),
};

export const loginFlow: Flow = [
  getU2FPublicKey,
  getU2FChallenge,
  u2fAuthenticate,
  postU2FSignature,
];

export type LoginFlowResponse = {
  u2f_key: {
    pubKey: string,
    signature: string,
  },
  u2f_challenge: {
    token: string,
    key_handle: string,
  },
  u2f_authenticate: {
    rawResponse: string,
  },
  organization: Organization,
};
