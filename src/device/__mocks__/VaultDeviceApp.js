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
  // u2f_register: Buffer.from(
  //   "050493763adb668956613cd773cb168511356f26599d01aa8c5d7bd7ebdfdf87e8f6399eb1128613f33bb0c13267c38bef794bb060fc0a39f7f9f7d549afced9d5c3400100af25587d3ca7d84e5be17303d7b2ceb71661a1c028a014f86b1f2381c7553dda0cdb2ea15ac0e9aced55ee94b72bf2b690fabdb2d76dcde6edc3c4cf93d2a7356e1ab053eb47a4a64ee57e9181772802df334a324307e5368882b63a51355804db09fb62c364a32150e31e38a99250445580e25c8e615cb1903fc950b5f7abfdf86984efd4d3a076662b0f329011fcc9c1bed3b2e6c50e14361d3c50b4a037f3304402202a06e51eaeebff9dddfc0b43bb5366a8889c95cbce8e961f7f707a1ad5a9be160220040270fd9f3792b691c5e2b4be0027b90e9fe0fbc2e33fad34029f4d4bdf5cd3304402205534cff615a7e2ab0898d64ae9826bb379d6d0f877dda7c453e808d4845a893102203531df699a9ca591112a757528dc549054976d828d98144de1eb4107fb02f6b1",
  //   "hex"
  // ),
  // u2f_register: Buffer.from(
  //   "050493763adb668956613cd773cb168511356f26599d01aa8c5d7bd7ebdfdf87e8f6399eb1128613f33bb0c13267c38bef794bb060fc0a39f7f9f7d549afced9d5c3400100af25587d3ca7d84e5be17303d7b2ceb71661a1c028a014f86b1f2381c7553dda0cdb2ea15ac0e9aced55ee94b72bf2b690fabdb2d76dcde6edc3c4cf93d2a7356e1ab053eb47a4a64ee57e9181772802df334a324307e5368882b63a51355804db09fb62c364a32150e31e38a99250445580e25c8e615cb1903fc950b5f7abfdf86984efd4d3a076662b0f329011fcc9c1bed3b2e6c50e14361d3c50b4a037f3304402202a06e51eaeebff9dddfc0b43bb5366a8889c95cbce8e961f7f707a1ad5a9be160220040270fd9f3792b691c5e2b4be0027b90e9fe0fbc2e33fad34029f4d4bdf5cd3304402205534cff615a7e2ab0898d64ae9826bb379d6d0f877dda7c453e808d4845a893102203531df699a9ca591112a757528dc549054976d828d98144de1eb4107fb02f6b1",
  //   "hex"
  // ),
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
