// @flow
import { retry } from "network";
import type { Interaction } from "components/DeviceInteraction";
import { U2F_PATH, CONFIDENTIALITY_PATH, VALIDATION_PATH } from "device";
import { getPublicKey, getAttestationCertificate } from "device/interface";

export const getU2FPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "u2f_key",
  action: ({ transport }) =>
    retry(() => getPublicKey()(transport, U2F_PATH, false))
};

export const getConfidentialityPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "confidentiality_key",
  action: ({ transport }) =>
    retry(() => getPublicKey()(transport, CONFIDENTIALITY_PATH))
};

export const getValidationPublicKey: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "validation_key",
  action: ({ transport }) =>
    retry(() => getPublicKey()(transport, VALIDATION_PATH))
};

export const getAttestation: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "attestation",
  action: ({ transport }) => retry(() => getAttestationCertificate()(transport))
};
