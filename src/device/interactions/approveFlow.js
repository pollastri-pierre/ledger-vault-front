// @flow
import { getU2FPublicKey } from "device/interactions/common";
import type { DeviceError } from "utils/errors";
import { StatusCodes } from "@ledgerhq/hw-transport";
import type { Interaction } from "components/DeviceInteraction";
import { NoChannelForDevice } from "utils/errors";
import NewRequestMutation from "api/mutations/NewRequestMutation";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import RequestsQuery from "api/queries/RequestsQuery";
import {
  openSession,
  validateVaultOperation,
  authenticate,
} from "device/interface";
import {
  VALIDATION_PATH,
  CONFIDENTIALITY_PATH,
  APPID_VAULT_ADMINISTRATOR,
  ACCOUNT_MANAGER_SESSION,
  MATCHER_SESSION,
} from "device";
import network, { retryOnCondition, retry } from "network";

const postRequest: Interaction = {
  responseKey: "request_id",
  action: ({ data, type, restlay }) =>
    restlay
      .commitMutation(new NewRequestMutation({ type, ...data }))
      .then(request => request.id),
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

// FIXME should we put that in the component with a connectData() and a query and pass it
// through additionalFields props?
const getSecureChannel: Interaction = {
  responseKey: "secure_channel",
  action: ({ request_id }) =>
    network(`/requests/${request_id}/challenge`, "POST"),
};

const openSessionDevice: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "session",
  action: ({ u2f_key: { pubKey }, secure_channel, entity, transport }) =>
    retry(() => {
      const channel = secure_channel[pubKey];
      if (!channel) {
        throw new NoChannelForDevice();
      }

      return openSession()(
        transport,
        CONFIDENTIALITY_PATH,
        Buffer.from(channel.ephemeral_public_key, "hex"),
        Buffer.from(channel.certificate_attestation, "base64"),
        // TODO see if it's still correct ?
        entity === "account" ? ACCOUNT_MANAGER_SESSION : MATCHER_SESSION,
      );
    }),
};

const validateDevice: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "approval",
  action: ({ u2f_key: { pubKey }, secure_channel, transport }) =>
    retryOnCondition(
      () => {
        const channel = secure_channel[pubKey];
        const v = validateVaultOperation()(
          transport,
          VALIDATION_PATH,
          Buffer.from(channel.data, "base64"),
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

const postApproval: Interaction = {
  responseKey: "post",
  action: ({ approval, request_id, restlay, u2f_key: { pubKey } }) =>
    restlay.commitMutation(
      new ApproveRequestMutation({
        requestId: request_id,
        approval: approval.toString("base64"),
        pubKey,
      }),
    ),
};

export const approveFlow: Interaction[] = [
  getSecureChannel,
  getU2FPublicKey,
  openSessionDevice,
  validateDevice,
  postApproval,
  refetchPending,
];

// TODO remove this when HSM and gate will be ready
const tmp_getOrganization: Interaction = {
  responseKey: "organization",
  action: () => network(`/organization`, "GET"),
};
const tmp_getHSMChallenge: Interaction = {
  responseKey: "HSM_CHALLENGE_TMP",
  action: ({ request_id }) =>
    network(`/requests/${request_id}/challenge`, "POST"),
};

export const tmp_u2fAuthenticateHSM: Interaction = {
  needsUserInput: true,
  device: true,
  responseKey: "device_hsm_authenticate",
  action: ({
    transport,
    u2f_key: { pubKey },
    organization,
    HSM_CHALLENGE_TMP: { challenge, key_handle },
  }) =>
    retryOnCondition(
      () =>
        authenticate()(
          transport,
          Buffer.from(challenge, "base64"),
          APPID_VAULT_ADMINISTRATOR,
          Buffer.from(key_handle[pubKey.toUpperCase()], "base64"),
          organization.name,
          organization.workspace,
          organization.domain_name,
          "Administrator",
        ),
      {
        shouldThrow: (e: DeviceError) =>
          e.statusCode === StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED ||
          e.statusCode === StatusCodes.INCORRECT_DATA,
      },
    ),
};

const tmp_postHSM: Interaction = {
  responseKey: "DEVICE_RESPONSE_TMP",
  action: ({ request_id, device_hsm_authenticate, u2f_key: { pubKey } }) =>
    network(`/requests/${request_id}/authenticate`, "POST", {
      pub_key: pubKey,
      authentication: device_hsm_authenticate.rawResponse,
    }),
};
export const createAndApprove = [postRequest, ...approveFlow];
export const createAndApproveWithChallenge = [
  tmp_getOrganization, // to be removed when HSM ready
  postRequest,
  tmp_getHSMChallenge, // to be removed when HSM ready
  getU2FPublicKey, // to be removed when HSM ready
  tmp_u2fAuthenticateHSM, // to be removed when HSM ready
  tmp_postHSM, // to be removed when HSM ready
  ...approveFlow,
];
