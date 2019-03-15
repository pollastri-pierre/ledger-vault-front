// @flow
import { StatusCodes } from "@ledgerhq/hw-transport";
import network, { retryOnCondition } from "network";
import { APPID_VAULT_ADMINISTRATOR } from "device";
import { register } from "device/interface";
import {
  getU2FPublicKey,
  getAttestation,
  getConfidentialityPublicKey,
  getValidationPublicKey,
} from "device/interactions/common";
import type { Interaction } from "components/DeviceInteraction";
import type { DeviceError } from "utils/errors";

export const getU2FChallenge: Interaction = {
  needsUserInput: false,
  responseKey: "u2f_challenge",
  action: ({ urlID }) =>
    network(`/requests/registration/${urlID}/challenge`, "POST"),
};

export const u2fRegister: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "u2f_register",
  action: ({ transport, organization, u2f_challenge: { challenge }, member }) =>
    retryOnCondition(
      () =>
        register()(
          transport,
          Buffer.from(challenge, "base64"),
          APPID_VAULT_ADMINISTRATOR,
          organization.name,
          organization.workspace,
          organization.domain_name,
          member.user.role || "Administrator",
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    ),
};

// building the result
export const buildResult: Interaction = {
  responseKey: "build",
  action: ({
    u2f_register: { u2f_register, keyHandle },
    attestation,
    member,
    confidentiality_key,
    validation_key,
    u2f_key: { pubKey },
  }) => {
    const attestationOffset = 67 + u2f_register.readInt8(66);
    const u2f_register_attestation = Buffer.concat([
      u2f_register.slice(0, attestationOffset),
      Buffer.from([attestation.length]),
      attestation,
      u2f_register.slice(attestationOffset),
    ]);

    const validation_attestation = Buffer.concat([
      attestation,
      validation_key.signature,
    ]);
    const confidentiality_attestation = Buffer.concat([
      attestation,
      confidentiality_key.signature,
    ]);

    const data = {
      username: member.user.username,
      u2f_register: u2f_register_attestation.toString("hex"),
      pub_key: pubKey,
      key_handle: keyHandle.toString("hex"),
      validation: {
        public_key: validation_key.pubKey,
        attestation: validation_attestation.toString("hex"),
      },
      confidentiality: {
        public_key: confidentiality_key.pubKey,
        attestation: confidentiality_attestation.toString("hex"),
      },
    };
    return Promise.resolve(data);
  },
};

export const postResult: Interaction = {
  needsUserInput: false,
  responseKey: "result",
  action: ({ urlID, build }) =>
    network(`/requests/registration/${urlID}/authenticate`, "POST", build),
};

export const registerFlow = [
  getU2FChallenge,
  getU2FPublicKey,
  getConfidentialityPublicKey,
  getValidationPublicKey,
  getAttestation,
  u2fRegister,
  buildResult,
  postResult,
];
