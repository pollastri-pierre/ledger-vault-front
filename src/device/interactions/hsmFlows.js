// @flow
import React from "react";
import { StatusCodes } from "@ledgerhq/hw-transport";

import { NoChannelForDevice } from "utils/errors";
import NewRequestMutation from "api/mutations/NewRequestMutation";
import GetAddressQuery from "api/queries/GetAddressQuery";
import network, { retryOnCondition, retry } from "network";
import {
  APPID_VAULT_ADMINISTRATOR,
  ACCOUNT_MANAGER_SESSION,
  CONFIDENTIALITY_PATH,
  VALIDATION_PATH,
  MATCHER_SESSION,
} from "device";
import {
  register,
  openSession,
  registerData,
  validateVaultOperation,
} from "device/interface";
import {
  getU2FPublicKey,
  getAttestation,
  getConfidentialityPublicKey,
  getValidationPublicKey,
  generateFragmentSeed,
} from "device/interactions/common";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import RegisterUserMutation from "api/mutations/RegisterUserMutation";
import RequestsQuery from "api/queries/RequestsQuery";
import type { Interaction } from "components/DeviceInteraction";
import type { RequestTargetType } from "data/types";
import Text from "components/base/Text";
import type { DeviceError } from "utils/errors";

type CustomTargetType = "ACCOUNT" | "TRANSACTION" | "ADDRESS";
type TargetType = RequestTargetType | CustomTargetType;

export const postResult: Interaction = {
  needsUserInput: false,
  responseKey: "result",
  action: ({ urlID, register_input, restlay, member }) =>
    restlay.commitMutation(
      new RegisterUserMutation({
        urlID,
        body: { ...register_input, name: member.user.username },
      }),
    ),
};
export const getAddress: Interaction = {
  needsUserInput: false,
  responseKey: "address_channel",
  action: ({ accountId, fresh_address, restlay }) =>
    restlay.fetchQuery(
      new GetAddressQuery({
        accountId,
        derivation_path: fresh_address.derivation_path,
      }),
    ),
};

const buildCertif = (attestation: Buffer, signature: Buffer) => {
  const certLen = attestation.readInt8(32 + 65 + 1);
  return {
    code_hash: attestation.slice(0, 32).toString("base64"),
    attestation_pub: attestation.slice(32, 32 + 65).toString("base64"),
    certificate: attestation
      .slice(32 + 65, 32 + 65 + 2 + certLen)
      .toString("base64"),
    signature: signature.toString("base64"),
  };
};

const operatorGetChallenge: Interaction = {
  needsUserInput: false,
  responseKey: "onboardingRegisterChallenge",
  action: ({ u2f_key, confidentiality_key, attestation, urlID }) => {
    const data = {
      public_key: u2f_key.pubKey,
      confidentiality_key: confidentiality_key.pubKey,
      certificate: buildCertif(attestation, confidentiality_key.signature),
    };
    return network(`/requests/registration/${urlID}/challenge`, "POST", data);
  },
};
const onboardingGetChallenge: Interaction = {
  needsUserInput: false,
  responseKey: "onboardingRegisterChallenge",
  action: ({ u2f_key, confidentiality_key, attestation }) => {
    const data = {
      public_key: u2f_key.pubKey,
      confidentiality_key: confidentiality_key.pubKey,
      certificate: buildCertif(attestation, confidentiality_key.signature),
    };
    return network("/onboarding/challenge", "POST", data);
  },
};

const onboardingRegisterDevice: Interaction = {
  responseKey: "u2f_register",
  device: true,
  needsUserInput: true,
  action: async ({
    u2f_key,
    onboardingRegisterChallenge,
    role,
    username,
    transport,
  }) => {
    // either the channel is in a map indexed by public key ( onboarding ) or directly in registerChallenge ( register operator )
    const register_challenge =
      onboardingRegisterChallenge[
        u2f_key.pubKey.toString("hex").toUpperCase()
      ] || onboardingRegisterChallenge;

    const signature = Buffer.from(
      register_challenge.certificate.signature,
      "base64",
    );
    const attestation_pub = Buffer.from(
      register_challenge.certificate.attestation_pub,
      "base64",
    );
    const certificate = Buffer.from(
      register_challenge.certificate.certificate,
      "base64",
    );

    const challengeAttestation = Buffer.concat([
      Buffer.from([signature.length]),
      signature,
      attestation_pub,
      Buffer.from([certificate.length]),
      certificate,
    ]);

    await retry(() => {
      return openSession()(
        transport,
        CONFIDENTIALITY_PATH,
        Buffer.from(register_challenge.ephemeral_public_key, "hex"),
        challengeAttestation,
        ACCOUNT_MANAGER_SESSION,
      );
    });

    return retryOnCondition(
      () =>
        register()(
          transport,
          Buffer.from(register_challenge.challenge, "hex"),
          APPID_VAULT_ADMINISTRATOR,
          username,
          role,
          register_challenge.u2f_register_data,
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    );
  },
};

const onboardingRegisterData: Interaction = {
  responseKey: "register_data",
  action: ({ transport, u2f_key, onboardingRegisterChallenge }) => {
    // either the channel is in a map indexed by public key ( onboarding ) or directly in registerChallenge ( register operator )
    const register_challenge =
      onboardingRegisterChallenge[
        u2f_key.pubKey.toString("hex").toUpperCase()
      ] || onboardingRegisterChallenge;

    return retryOnCondition(
      () =>
        registerData()(
          transport,
          Buffer.from(register_challenge.challenge, "hex"),
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    );
  },
};

const onboardingPostResult: Interaction = {
  responseKey: "register_input",
  device: false,
  action: ({
    register_data,
    validation_key,
    u2f_register,
    attestation,
    u2f_key,
  }) => {
    const attestationOffset = 67 + u2f_register.u2f_register.readInt8(66);
    const registration_payload = Buffer.concat([
      u2f_register.u2f_register.slice(0, attestationOffset),
      Buffer.from([attestation.length]),
      attestation,
      u2f_register.u2f_register.slice(attestationOffset),
    ]);
    const data = {
      public_key: u2f_key.pubKey.toString("hex"),
      key_handle: u2f_register.keyHandle.toString("hex"),
      validation_key: validation_key.pubKey.toString("hex"),
      register_data: register_data.toString("hex"),
      u2f_register: registration_payload.toString("hex"),
      certificate: buildCertif(attestation, validation_key.signature),
    };

    return Promise.resolve(data);
  },
};

export const registerUserFlow = [
  getU2FPublicKey,
  getValidationPublicKey,
  getConfidentialityPublicKey,
  getAttestation,
  operatorGetChallenge,
  onboardingRegisterDevice,
  onboardingRegisterData,
  onboardingPostResult,
  postResult,
];
export const onboardingRegisterFlow = [
  getU2FPublicKey,
  getValidationPublicKey,
  getConfidentialityPublicKey,
  getAttestation,
  onboardingGetChallenge,
  onboardingRegisterDevice,
  onboardingRegisterData,
  onboardingPostResult,
];

const openSessionValidate: Interaction = {
  device: true,
  responseKey: "channel_blob",
  action: async ({ transport, secure_channels, u2f_key, targetType }) => {
    const channel =
      secure_channels[u2f_key.pubKey.toString("hex").toUpperCase()];
    if (!channel) {
      throw new NoChannelForDevice();
    }
    await retry(() => {
      const signature = Buffer.from(channel.certificate.signature, "base64");
      const attestation_pub = Buffer.from(
        channel.certificate.attestation_pub,
        "base64",
      );
      const certificate = Buffer.from(
        channel.certificate.certificate,
        "base64",
      );
      const certif = Buffer.concat([
        Buffer.from([signature.length]),
        signature,
        attestation_pub,
        Buffer.from([certificate.length]),
        certificate,
      ]);
      const TransactionTargetsType = [
        "BITCOIN_LIKE_TRANSACTION",
        "ETHEREUM_LIKE_TRANSACTION",
      ];
      return openSession()(
        transport,
        CONFIDENTIALITY_PATH,
        Buffer.from(channel.ephemeral_public_key, "hex"),
        certif,
        targetType && TransactionTargetsType.indexOf(targetType) > -1
          ? MATCHER_SESSION
          : ACCOUNT_MANAGER_SESSION,
      );
    });

    return Promise.resolve(channel.blob);
  },
};
const openSessionVerifyAddress: Interaction = {
  device: true,
  responseKey: "channel_blob",
  action: async ({ transport, address_channel }) => {
    await retry(() => {
      const signature = Buffer.from(
        address_channel.certificate.signature,
        "base64",
      );
      const attestation_pub = Buffer.from(
        address_channel.certificate.attestation_pub,
        "base64",
      );
      const certificate = Buffer.from(
        address_channel.certificate.certificate,
        "base64",
      );
      const certif = Buffer.concat([
        Buffer.from([signature.length]),
        signature,
        attestation_pub,
        Buffer.from([certificate.length]),
        certificate,
      ]);
      return openSession()(
        transport,
        CONFIDENTIALITY_PATH,
        Buffer.from(address_channel.ephemeral_public_key, "hex"),
        certif,
        ACCOUNT_MANAGER_SESSION,
      );
    });

    return Promise.resolve(address_channel.blob);
  },
};

const validateDevice = (entity: ?TargetType): Interaction => ({
  device: true,
  needsUserInput: true,
  responseKey: "validate_device",
  tooltip: entity ? (
    <Text small i18nKey={`deviceInteractions:${entity}`} />
  ) : null,
  action: ({ transport, channel_blob }) => {
    return retryOnCondition(
      () =>
        validateVaultOperation()(
          transport,
          VALIDATION_PATH,
          Buffer.from(channel_blob, "base64"),
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    );
  },
});

export const validateOperation = (entity: ?TargetType) => [
  getU2FPublicKey,
  openSessionValidate,
  validateDevice(entity),
];

export const validateAdddress = [
  getU2FPublicKey,
  openSessionVerifyAddress,
  validateDevice("ADDRESS"),
];

const getSecureChannel: Interaction = {
  responseKey: "secure_channels",
  action: async ({ request_id }) => {
    return network(`/requests/${request_id}/challenge`, "POST", {});
  },
};

const postApproval: Interaction = {
  responseKey: "post",
  action: ({ request_id, restlay, u2f_key: { pubKey }, validate_device }) =>
    restlay.commitMutation(
      new ApproveRequestMutation({
        requestId: request_id,
        signature: validate_device.toString("base64"),
        public_key: pubKey.toString("hex"),
      }),
    ),
};

const refetchPending: Interaction = {
  responseKey: "pending",
  action: ({ restlay }) =>
    restlay.fetchQuery(
      new RequestsQuery({
        status: ["PENDING_APPROVAL", "PENDING_REGISTRATION"],
        pageSize: -1,
      }),
    ),
};
const postRequest: Interaction = {
  responseKey: "request_id",
  action: ({ data, type, restlay }) =>
    restlay
      .commitMutation(new NewRequestMutation({ type, ...data }))
      .then(request => request.id),
};
export const approveFlow = (entity: TargetType) => [
  getSecureChannel,
  ...validateOperation(entity),
  postApproval,
  refetchPending,
];
export const verifyAddressFlow = [getAddress, ...validateAdddress];
export const createAndApprove = (entity: TargetType) => [
  postRequest,
  ...approveFlow(entity),
];

export const generateSeed = [
  getU2FPublicKey,
  openSessionValidate,
  validateDevice(),
  generateFragmentSeed,
];
