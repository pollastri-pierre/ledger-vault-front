//@flow
import network from "network";

export const ENDPOINTS = {
  GET_PUBLIC_KEY: "/get-public-key",
  GET_ATTESTATION: "/get-attestation",
  OPEN_SESSION: "/open-session",
  AUTHENTICATE: "/authenticate",
  REGISTER: "/register",
  VALIDATE_VAULT_OPERATION: "/validate-vault-operation",
  GENERATE_KEY_FRAGMENTS: "/generate-key-fragments"
};

const pathArrayToString = (path: number[]): string =>
  `${path[0] & 0xfffffff}'/${path[1] & 0xfffffff}'`;

export default class VaultDeviceHTTP {
  async getPublicKey(
    path: number[],
    secp256k1: boolean = true
  ): Promise<{
    pubKey: string,
    signature: string
  }> {
    const data = await network(ENDPOINTS.GET_PUBLIC_KEY, "POST", {
      path: pathArrayToString(path),
      secp256k1
    });
    return {
      pubKey: data["pubKey"],
      signature: Buffer.from(data["attestation"], "hex")
    };
  }

  async getAttestationCertificate(): Promise<Buffer> {
    const data = await network(ENDPOINTS.GET_ATTESTATION, "GET");
    return Buffer.from(data, "hex");
  }

  async generateKeyComponent(
    path: number[],
    isWrappingKey: boolean
  ): Promise<*> {
    let p1 = 0x00;
    if (isWrappingKey) {
      p1 = 0x01;
    }
    const data = await network(ENDPOINTS.GENERATE_KEY_FRAGMENTS, "POST", {
      path: pathArrayToString(path),
      goal: p1
    });
    return Buffer.from(data, "hex");
  }

  async authenticate(
    challenge: Buffer,
    application: string,
    keyHandle: Buffer,
    instanceName: string,
    instanceReference: string,
    instanceUrl: string,
    agentRole: string
  ): Promise<{
    userPresence: *,
    counter: *,
    signature: string,
    rawResponse: string
  }> {
    const response = await network(ENDPOINTS.AUTHENTICATE, "POST", {
      challenge: challenge.toString("hex"),
      application,
      key_handle: keyHandle.toString("hex"),
      name: instanceName,
      role: agentRole,
      domain_name: instanceUrl,
      workspace: instanceReference
    });

    const userPresence = response.slice(0, 1);
    const counter = response.slice(1, 5);
    const signature = response.slice(5, response.length - 2).toString("hex");
    return {
      userPresence,
      counter,
      signature,
      rawResponse: response.toString("hex")
    };
  }

  async register(
    challenge: Buffer,
    application: string,
    instanceName: string,
    instanceReference: string,
    instanceUrl: string,
    agentRole: string
  ): Promise<{
    u2f_register: Buffer,
    keyHandle: Buffer
  }> {
    const data = await network(ENDPOINTS.REGISTER, "POST", {
      challenge: challenge.toString("hex"),
      application,
      name: instanceName,
      role: agentRole,
      domain_name: instanceUrl,
      workspace: instanceReference
    });
    const response = Buffer.from(data, "hex");
    let i = 0;
    const rfu = response.slice(i, (i += 1))[0];
    const pubKey = response.slice(i, (i += 65)).toString("hex");
    const keyHandleLength = response.slice(i, ++i)[0];
    const keyHandle = response.slice(i, (i += keyHandleLength));
    // const attestationSignature = lastResponse.slice(i, ++i)[0];
    // const signature = lastResponse.slice(i).toString("hex");
    return {
      u2f_register: response.slice(0, response.length - 2),
      keyHandle: keyHandle,
      rfu,
      pubKey
    };
  }

  async openSession(
    path: number[],
    pubKey: Buffer,
    attestation: Buffer,
    scriptHash: number = 0x00
  ): Promise<*> {
    const data = await network(ENDPOINTS.OPEN_SESSION, "POST", {
      path: pathArrayToString(path),
      pubKey: pubKey.toString("hex"),
      attestation: attestation.toString("hex"),
      scriptHash
    });
    return data;
  }

  async validateVaultOperation(path: number[], operation: Buffer) {
    const data = await network(ENDPOINTS.VALIDATE_VAULT_OPERATION, "POST", {
      path: pathArrayToString(path),
      operation: operation.toString("hex")
    });
    return Buffer.from(data, "hex");
  }
}
