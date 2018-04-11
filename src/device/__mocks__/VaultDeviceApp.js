export const mockRegister = jest.fn().mockReturnValue({
  rfu: "rfu",
  pubKey: "pubKey",
  keyHandle: ["handle1"],
  attestationSignature: "attestationSignature",
  signature: "signature",
  rawResponse: "raw"
});
export const mockAuthenticate = jest.fn().mockReturnValue({
  userPresence: "userPresence",
  counter: 0,
  signature: "signature",
  rawResponse: "raw"
});
export const mockGetPublicKey = jest.fn().mockReturnValue({
  pubKey: "pubKey",
  signature: "signature"
});

export const mockOpenSession = jest.fn();
export const mockGenerateKeyComponent = jest.fn().mockReturnValue("seedShard");

const mock = jest.fn().mockImplementation(() => {
  return {
    register: mockRegister,
    getPublicKey: mockGetPublicKey,
    authenticate: mockAuthenticate,
    openSession: mockOpenSession,
    generateKeyComponent: mockGenerateKeyComponent
  };
});

export default mock;
