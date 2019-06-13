// @flow

import { retry } from "network";
import {
  getConfidentialityPublicKey,
  getU2FPublicKey,
  getAttestation,
  generateWrappingKey,
} from "device/interactions/common";
import type { Interaction } from "components/DeviceInteraction";
import { openSession } from "device/interface";
import { CONFIDENTIALITY_PATH, INIT_SESSION } from "device";

const openSessionDevice: Interaction = {
  needsUserInput: false,
  device: true,
  responseKey: "session",
  action: ({ secure_channel, transport }) =>
    retry(() => {
      const signature = Buffer.from(
        secure_channel.ephemeral_certificate.signature,
        "base64",
      );
      const attestation_pub = Buffer.from(
        secure_channel.ephemeral_certificate.attestation_pub,
        "base64",
      );
      const certificate = Buffer.from(
        secure_channel.ephemeral_certificate.certificate,
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
        Buffer.from(secure_channel.ephemeral_public_key, "hex"),
        certif,
        INIT_SESSION,
      );
    }),
};

const postFragment: Interaction = {
  responseKey: "fragment",
  action: ({ blob, confidentiality_key, attestation, u2f_key }) => {
    const certLen = attestation.readInt8(98);
    const certificate = {
      code_hash: attestation.slice(0, 32).toString("base64"),
      attestation_pub: attestation.slice(32, 32 + 65).toString("base64"),
      certificate: attestation
        .slice(32 + 65, 32 + 65 + 2 + certLen)
        .toString("base64"),
      signature: confidentiality_key.signature.toString("base64"),
    };
    const data = {
      public_key: u2f_key.pubKey.toString("hex"),
      blob: blob.toString("base64"),
      certificate,
      ephemeral_public_key: confidentiality_key.pubKey,
    };
    return Promise.resolve(data);
  },
};

export const generateWrappingKeyFlow = [
  getU2FPublicKey,
  getConfidentialityPublicKey,
  openSessionDevice,
  getAttestation,
  generateWrappingKey,
  postFragment,
];
