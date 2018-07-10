export const mockRegister = jest.fn().mockReturnValue({
  rfu: "rfu",
  pubKey: "pubKey",
  keyHandle: Buffer.from("handle1", "hex"),
  attestationSignature: "attestationSignature",
  signature: "signature",
  u2f_register: Buffer.from(
    "05049df429f83d95518671b5b23c3446e07b570a97ae4182e4ef34c01668bd0dc5b5868d446d5de51e9fd07664ceecbe16ca1168e60e282e2b87310d8cca5e6755024000c2ad6746acef256bd23fb6f20d7f2f7bb374ceae473f22f249a3701837e4697bbe9e4148f9b91d7fa3253f1a6b4797b1137da25ec856bad5662e2e2e6d6b8a402210096be5e4e4ca26ca7a40c98041cd5ed22523f37315f39bec2764403aa9f2a6ae7021f228848c25f48f3e1aa42f71b7c83ff011d71b80cdcc58734c6448ce62e1b0a",
    "hex"
  ),
  rawResponse: "raw"
});
export const mockAuthenticate = jest.fn().mockImplementation(() => ({
  userPresence: "userPresence",
  counter: 0,
  signature: "signature",
  rawResponse: "raw"
}));
export const mockGetPublicKey = jest.fn().mockReturnValue({
  pubKey: "pubKey",
  signature: "signature"
});

export const mockOpenSession = jest.fn();
export const mockGetAttestationCertificate = jest
  .fn()
  .mockReturnValue("certificate");
export const mockGenerateKeyComponent = jest.fn().mockReturnValue("seedShard");

const mock = jest.fn().mockImplementation(() => {
  return {
    register: mockRegister,
    getAttestationCertificate: mockGetAttestationCertificate,
    getPublicKey: mockGetPublicKey,
    authenticate: mockAuthenticate,
    openSession: mockOpenSession,
    generateKeyComponent: mockGenerateKeyComponent
  };
});

export default mock;
