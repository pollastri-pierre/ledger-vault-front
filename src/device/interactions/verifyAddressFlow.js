// @flow
import type { DeviceError } from "utils/errors";
import { StatusCodes } from "@ledgerhq/hw-transport";
import GetAddressQuery from "api/queries/GetAddressQuery";
import type { Interaction } from "components/DeviceInteraction";

import { openSession, validateVaultOperation } from "device/interface";
import { VALIDATION_PATH, CONFIDENTIALITY_PATH, MATCHER_SESSION } from "device";
import { retryOnCondition, retry } from "network";

type Flow = Interaction[];

export const getAddress: Interaction = {
  needsUserInput: false,
  responseKey: "address",
  action: ({ accountId, fresh_address, restlay }) =>
    restlay.fetchQuery(
      new GetAddressQuery({
        accountId,
        derivation_path: fresh_address.derivation_path,
      }),
    ),
};

const openSessionDevice: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "session",
  action: ({ address, transport }) =>
    retry(() => {
      return openSession()(
        transport,
        CONFIDENTIALITY_PATH,
        Buffer.from(address.ephemeral_public_key, "hex"),
        Buffer.from(address.attestation_certificate, "base64"),
        MATCHER_SESSION,
      );
    }),
};

const validateAddress: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "verified",
  action: ({ address, transport }) =>
    retryOnCondition(
      () => {
        const v = validateVaultOperation()(
          transport,
          VALIDATION_PATH,
          Buffer.from(address.wallet_address, "base64"),
        );
        return v;
      },
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    ),
};

export const verifyAddressFlow: Flow = [
  getAddress,
  openSessionDevice,
  validateAddress,
];
