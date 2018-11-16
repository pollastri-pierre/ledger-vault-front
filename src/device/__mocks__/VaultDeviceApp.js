export const mockRegister = jest.fn().mockReturnValue({
  rfu: "rfu",
  pubKey: "pubKey",
  keyHandle: Buffer.from(
    "1d45df520d9bb6834f0f0652456ed7a80f2d3068152329a31a07dee89f5f8525cfa7df315e83155dc39d0b5098f5313a70752c96b4c99af60b03bdc77b52f54c",
    "hex"
  ),
  attestationSignature: "attestationSignature",
  signature: "signature",
  u2f_register: Buffer.from(
    "0504606b50147502fb26bc346b1fd02af837c897c68b7059d0f31587fc8e3fbd003d555ddaace2ad2b0a17c0d298e4ff925c9eb3b450ac8bce3d1bb8cfea3647fc4340138f86ab87380962decb37598f5a83ac44e83e7e6b03edee4dfb354000394779ceddd950d2bb7696c4abb469edb507112ce8822935b3604e361666235a942714a7780bf0d00c19e477afa2391aca6cc7dec19ac7abe9bc69f06080af36b100b3d2022033a5e6e2ffd08b8c707d2019ef78dfea400da6df5b9862cd8a1a5c5d72281ac93044022015547b728a266a209bed07b3934232c35edcde550e68ea7792ceb8d7963f490e022021d354aa36e29219cf5fe3fb1704a582f9eeac51ad07a2f9b25be5148a7f8538",
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
  signature: Buffer.from("signature", "hex")
});

export const mockOpenSession = jest.fn();
export const mockGetVersion = jest.fn().mockReturnValue({
  appName: "Vault",
  appVersion: process.env["APP_VERSION"]
});
export const mockGetAttestationCertificate = jest
  .fn()
  .mockReturnValue(
    Buffer.from(
      "6fc65a01643a104bbed2a82dc0d87c88a353c7e438c0fb7a0796c04337a022bb04efc11ec4ece4ac5d3e16ba7740f5692480dcb8ff79537daf5a812fd53d84ab6c460f4ca1529719d1d95d6dd38a2532eedd27d339798d05a1ae2b7d9741973a2930440220",
      "hex"
    )
  );
export const mockGenerateKeyComponent = jest.fn().mockReturnValue("seedShard");

export const mockValidateVaultOperation = jest.fn().mockReturnValue("approval");

const mock = jest.fn().mockImplementation(() => {
  return {
    register: mockRegister,
    getAttestationCertificate: mockGetAttestationCertificate,
    getVersion: mockGetVersion,
    getPublicKey: mockGetPublicKey,
    authenticate: mockAuthenticate,
    openSession: mockOpenSession,
    validateVaultOperation: mockValidateVaultOperation,
    generateKeyComponent: mockGenerateKeyComponent
  };
});

export default mock;
