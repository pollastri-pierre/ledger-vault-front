// @flow
import type Transport from "@ledgerhq/hw-transport";
import invariant from "invariant";

export default class VaultDeviceApp {
  transport: Transport<*>;
  constructor(transport: Transport<*>) {
    this.transport = transport;
    this.transport.debug = true;
    transport.setScrambleKey("v1+");
  }

  async register(
    challenge: Buffer,
    application: string,
    instanceName: string,
    instanceReference: string,
    instanceURL: string,
    agentRole: string
  ): Promise<{
    rfu: number,
    keyHandle: string,
    attestationSignature: string,
    signature: string,
    rawResponse: string
  }> {
    invariant(
      challenge.length === 32,
      "challenge hex is expected to have 32 bytes"
    );
    const applicationBuf = Buffer.from(application, "hex");
    invariant(
      applicationBuf.length === 32,
      "application hex is expected to have 32 bytes"
    );
    const instanceNameBuf = Buffer.from(instanceName);
    const instanceReferenceBuf = Buffer.from(instanceReference);
    const instanceURLBuf = Buffer.from(instanceURL);
    const agentRoleBuf = Buffer.from(agentRole);
    const data = Buffer.concat([
      challenge,
      applicationBuf,
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);
    const response = await await this.transport.send(
      0xe0,
      0x01,
      0x00,
      0x00,
      data
    );
    let i = 0;
    const rfu = response.slice(i, (i += 1))[0];
    const pubKey = response.slice(i, (i += 65)).toString("hex");
    const keyHandleLength = response.slice(i, ++i)[0];
    const keyHandle = response.slice(i, (i += keyHandleLength));
    const attestationSignature = response.slice(i, ++i)[0];
    const signature = response.slice(i).toString("hex");
    return {
      rfu,
      pubKey,
      keyHandle,
      attestationSignature,
      signature,
      rawResponse: response.toString("hex")
    };
  }

  async authenticate(
    challenge: Buffer,
    application: string,
    keyHandle: Buffer,
    instanceName: string,
    instanceReference: string,
    instanceURL: string,
    agentRole: string
  ): Promise<{
    userPresence: *,
    counter: *,
    signature: string,
    rawResponse: string
  }> {
    invariant(
      challenge.length === 32,
      "challenge hex is expected to have 32 bytes"
    );
    const applicationBuf = Buffer.from(application, "hex");
    invariant(
      applicationBuf.length === 32,
      "application hex is expected to have 32 bytes"
    );
    const instanceNameBuf = Buffer.from(instanceName);
    const instanceReferenceBuf = Buffer.from(instanceReference);
    const instanceURLBuf = Buffer.from(instanceURL);
    const agentRoleBuf = Buffer.from(agentRole);
    const data = Buffer.concat([
      challenge,
      applicationBuf,
      Buffer.from([keyHandle.length]),
      keyHandle,
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);
    const response = await this.transport.send(0xe0, 0x02, 0x00, 0x00, data);
    const userPresence = response.slice(0, 1);
    const counter = response.slice(1, 5);
    const signature = response.slice(5).toString("hex");
    return {
      userPresence,
      counter,
      signature,
      rawResponse: response.toString("hex")
    };
  }

  async generateKeyComponent(path: number[]): Promise<*> {
    const data = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);
    const response = await this.transport.send(0xe0, 0x44, 0x00, 0x00, data);
    return response.slice(0, response.length - 2);
  }

  async openSession(
    path: number[],
    pubKey: Buffer,
    attestation: Buffer
  ): Promise<*> {
    const dataDerivation = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);

    const dataBuffer = Buffer.concat([dataDerivation, pubKey, attestation]);
    const response = await this.transport.send(
      0xe0,
      0x42,
      0x00,
      0x00,
      dataBuffer
    );
    return response;
  }

  splits(chunk: number, buffer: Buffer): Buffer[] {
    const chunks = [];
    for (let i = 0, size = chunk; i < buffer.length; i += size, size = chunk) {
      chunks.push(buffer.slice(i, i + size));
    }
    return chunks;
  }

  async validateVaultOperation(path: number[], operation: Buffer) {
    const maxLength = 100;
    const paths = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);

    const length = Buffer.alloc(2);
    length.writeUInt16BE(operation.length, 0);
    let chunks = [operation];

    if (maxLength < operation.length) {
      chunks = this.splits(maxLength, operation);
    }

    const data = Buffer.concat([paths, length, chunks.shift()]);
    let lastResponse = await this.transport.send(0xe0, 0x45, 0x00, 0x00, data);

    for (let i = 0; i < chunks.length; i++) {
      lastResponse = await this.transport.send(
        0xe0,
        0x45,
        0x80,
        0x00,
        chunks[i]
      );
    }

    return lastResponse.slice(0, lastResponse.length - 2);
  }

  async getPublicKey(
    path: number[],
    secp256k1: boolean = true
  ): Promise<{
    pubKey: string,
    signature: string
  }> {
    const data = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);
    let curve = 0x01;
    if (!secp256k1) {
      curve = 0x02;
    }
    const response = await this.transport.send(0xe0, 0x40, curve, 0x00, data);
    const pubKeyLength = response.readInt8(0);
    const pubKey = response.slice(1, pubKeyLength + 1).toString("hex");
    const signature = response.slice(pubKeyLength + 1, response.length - 2);
    return { pubKey, signature };
  }
}
