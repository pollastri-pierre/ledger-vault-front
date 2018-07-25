//@flow
import network from "network";

export const ENDPOINTS = {
  GET_PUBLIC_KEY: "/get-public-key",
  GET_ATTESTATION: "/get-attestation",
  OPEN_SESSION: "/open-session",
  GENERATE_KEY_COMPONENT: "/generate-key-component"
};

export default class VaultDeviceHTTP {
  async getPublicKey(
    path: number[],
    secp256k1: boolean = true
  ): Promise<{
    pubKey: string,
    signature: string
  }> {
    const data = await network(ENDPOINTS.GET_PUBLIC_KEY, "POST", {
      path,
      secp256k1
    });
    return data;
  }

  async getAttestationCertificate(): Promise<Buffer> {
    const data = await network(ENDPOINTS.GET_ATTESTATION, "POST");
    return data;
  }

  async generateKeyComponent(
    path: number[],
    isWrappingKey: boolean
  ): Promise<*> {
    let p1 = 0x00;
    if (isWrappingKey) {
      p1 = 0x01;
    }
    const data = await network(ENDPOINTS.GENERATE_KEY_COMPONENT, "POST", {
      path,
      goal: p1
    });
    return data;
  }

  async openSession(
    path: number[],
    pubKey: Buffer,
    attestation: Buffer,
    scriptHash: number = 0x00
  ): Promise<*> {
    const data = await network(ENDPOINTS.OPEN_SESSION, "POST", {
      path,
      pubKey: pubKey.toString("hex"),
      attestation: attestation.toString("hex"),
      scriptHash
    });
    return data;
  }
}
