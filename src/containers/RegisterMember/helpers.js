// @flow
import network from "network";

import createDevice, {
  U2F_PATH,
  CONFIDENTIALITY_PATH,
  APPID_VAULT_ADMINISTRATOR,
  VALIDATION_PATH
} from "device";

export const getAuthentication = async (
  challenge: string,
  organization: *,
  member: *
) => {
  const device = await await createDevice();
  const { pubKey } = await device.getPublicKey(U2F_PATH, false);
  const confidentiality = await device.getPublicKey(CONFIDENTIALITY_PATH);
  const validation = await device.getPublicKey(VALIDATION_PATH);
  const attestation = await device.getAttestationCertificate();

  const { u2f_register, keyHandle } = await device.register(
    Buffer.from(challenge, "base64"),
    APPID_VAULT_ADMINISTRATOR,
    organization.name,
    organization.workspace,
    organization.domain_name,
    member.user.role || "Administrator"
  );

  const attestationOffset = 67 + u2f_register.readInt8(66);
  const u2f_register_attestation = Buffer.concat([
    u2f_register.slice(0, attestationOffset),
    Buffer.from([attestation.length]),
    attestation,
    u2f_register.slice(attestationOffset)
  ]);

  const validation_attestation = Buffer.concat([
    attestation,
    validation.signature
  ]);
  const confidentiality_attestation = Buffer.concat([
    attestation,
    confidentiality.signature
  ]);

  const data = {
    username: member.user.uername,
    u2f_register: u2f_register_attestation.toString("hex"),
    pub_key: pubKey,
    key_handle: keyHandle.toString("hex"),
    validation: {
      public_key: validation.pubKey,
      attestation: validation_attestation.toString("hex")
    },
    confidentiality: {
      public_key: confidentiality.pubKey,
      attestation: confidentiality_attestation.toString("hex")
    }
  };
  const response = await network(
    `/requests/registration/${member.url_id}/authenticate`,
    "POST",
    data
  );
  return response;
};
