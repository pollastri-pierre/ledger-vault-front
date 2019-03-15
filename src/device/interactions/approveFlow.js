import { getU2FPublicKey } from "device/interactions/common";
import { NoChannelForDevice } from "utils/errors";
import NewRequestMutation from "api/mutations/NewRequestMutation";
import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import { openSession, validateVaultOperation } from "device/interface";
import {
  VALIDATION_PATH,
  CONFIDENTIALITY_PATH,
  ACCOUNT_MANAGER_SESSION,
  MATCHER_SESSION,
} from "device";
import network from "network";

const postRequest = {
  responseKey: "request_id",
  action: ({ data, type, restlay }) =>
    restlay
      .commitMutation(new NewRequestMutation({ type, ...data }))
      .then(request => request.id),
};

// FIXME should we put that in the component with a connectData() and a query and pass it
// through additionalFields props?
const getSecureChannel = {
  responseKey: "secure_channel",
  action: ({ request_id }) =>
    network(`/requests/${request_id}/challenge`, "POST"),
};

const openSessionDevice = {
  needsUserInput: false,
  device: true,
  responseKey: "session",
  action: ({ u2f_key: { pubKey }, secure_channel, entity }) => {
    const channel = secure_channel[pubKey];
    if (!channel) {
      throw new NoChannelForDevice();
    }

    return openSession(
      CONFIDENTIALITY_PATH,
      Buffer.from(channel.ephemeral_public_key, "hex"),
      Buffer.from(channel.certificate_attestation, "base64"),
      // TODO see if it's still correct ?
      entity === "account" ? ACCOUNT_MANAGER_SESSION : MATCHER_SESSION,
    );
  },
};

const validateDevice = {
  needsUserInput: true,
  device: true,
  responseKey: "approval",
  action: ({ u2f_key: { pubKey }, secure_channel }) => {
    const channel = secure_channel[pubKey];
    return validateVaultOperation(
      VALIDATION_PATH,
      Buffer.from(channel.data, "base64"),
    );
  },
};

const postApproval = {
  responseKey: "post",
  action: ({ approval, request_id, restlay }) =>
    restlay.commitMutation(
      new ApproveRequestMutation({ requestId: request_id, approval }),
    ),
};

export const approveFlow = [
  getSecureChannel,
  getU2FPublicKey,
  openSessionDevice,
  validateDevice,
  postApproval,
];

export const createAndApprove = [postRequest, ...approveFlow];
