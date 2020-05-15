// @flow
import React from "react";

import network from "network";
import { APPID_VAULT_ADMINISTRATOR } from "device/constants";
import { authenticate } from "device/interface";
import type { Interaction } from "components/DeviceInteraction";
import Text from "components/base/Text";
import { UnknownDevice } from "utils/errors";
import type { Organization } from "data/types";
import { getU2FPublicKey } from "device/interactions/common";
import { logout } from "redux/modules/auth";

type Flow = Interaction[];

export const getU2FChallenge: Interaction = {
  needsUserInput: false,
  responseKey: "u2f_challenge",
  action: async ({ u2f_key: { pubKey }, dispatch }) => {
    const challenge = await network(
      `/u2f/authentications/${pubKey}/challenge`,
      "GET",
    );
    if (!challenge.key_handle) {
      dispatch(logout());
      throw new UnknownDevice();
    }
    return challenge;
  },
};

export const u2fAuthenticate: Interaction = {
  needsUserInput: true,
  device: true,
  tooltip: <Text i18nKey="deviceInteractions:u2f_authenticate" />,
  responseKey: "u2f_authenticate",
  action: ({
    transport,
    u2f_challenge: { challenge, key_handle, role, name },
    organization,
  }) =>
    authenticate()(
      transport,
      Buffer.from(challenge, "base64"),
      APPID_VAULT_ADMINISTRATOR,
      Buffer.from(key_handle, "hex"),
      name,
      role,
      organization.workspace,
    ),
};

export const postU2FSignature: Interaction = {
  responseKey: "u2f_sign",
  action: ({ u2f_authenticate }) =>
    network(`/u2f/authentications/authenticate`, "POST", {
      authentication: u2f_authenticate.rawResponse,
    }),
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
    challenge: string,
    key_handle: string,
  },
  u2f_authenticate: {
    rawResponse: string,
  },
  organization: Organization,
};
