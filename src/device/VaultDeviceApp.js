// @flow
import type Transport from "@ledgerhq/hw-transport";
import invariant from "invariant";

const instanceName = location.pathname.split("/")[1];
const instanceReference = location.pathname.split("/")[1];
const instanceUrl = location.origin;
const agentRole = "Administrator";

export default class VaultDeviceApp {
  transport: Transport<*>;
  constructor(transport: Transport<*>) {
    this.transport = transport;
    this.transport.debug = true;
    transport.setScrambleKey("v1+");
  }

  async register(
    challenge: Buffer,
    application: string
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
    const instanceURLBuf = Buffer.from(instanceUrl);
    const agentRoleBuf = Buffer.from(agentRole);

    const maxLength = 200;

    const bigChunk = Buffer.concat([
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);

    const length = Buffer.alloc(2);
    length.writeUInt16BE(bigChunk.length, 0);

    let chunks = this.splits(maxLength, bigChunk);

    const data = Buffer.concat([
      challenge,
      applicationBuf,
      length,
      chunks.shift()
    ]);

    let lastResponse = await await this.transport.send(
      0xe0,
      0x01,
      0x00,
      0x00,
      data
    );

    for (let i = 0; i < chunks.length; i++) {
      lastResponse = await this.transport.send(
        0xe0,
        0x01,
        0x80,
        0x00,
        chunks[i]
      );
    }

    let i = 0;
    const rfu = lastResponse.slice(i, (i += 1))[0];
    const pubKey = lastResponse.slice(i, (i += 65)).toString("hex");
    const keyHandleLength = lastResponse.slice(i, ++i)[0];
    const keyHandle = lastResponse.slice(i, (i += keyHandleLength));
    const attestationSignature = lastResponse.slice(i, ++i)[0];
    const signature = lastResponse.slice(i).toString("hex");
    return {
      rfu,
      pubKey,
      keyHandle,
      attestationSignature,
      signature,
      rawResponse: lastResponse.toString("hex")
    };
  }

  async authenticateBootstrap(
    challenge: Buffer,
    application: string,
    keyHandle: Buffer
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
    const instanceNameBuf = Buffer.from("");
    const instanceReferenceBuf = Buffer.from("");
    const instanceURLBuf = Buffer.from("");
    const agentRoleBuf = Buffer.from("");
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

  async authenticate(
    challenge: Buffer,
    application: string,
    keyHandle: Buffer
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
    const maxLength = 150;

    const instanceNameBuf = Buffer.from(instanceName);
    const instanceReferenceBuf = Buffer.from(instanceReference);
    const instanceURLBuf = Buffer.from(instanceUrl);
    const agentRoleBuf = Buffer.from(agentRole);

    // | Challenge parameter                                                               | 32
    // | Application parameter                                                             | 32
    // | Key handle length                                                                 | 1
    // | Key handle                                                                        | var
    // | Key handle data length (big endian)                                               | 2
    // | Instance name length                                                              | 1
    // | Instance name                                                                     | var
    // | Instance reference length                                                         | 1
    // | Instance reference                                                                | var
    // | Instance URL length                                                               | 1
    // | Instance URL                                                                      | var
    // | Agent role length                                                                 | 1
    // | Agent role                                                                        | var
    //

    const bigChunk = Buffer.concat([
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);

    const length = Buffer.alloc(2);
    length.writeUInt16BE(bigChunk.length, 0);

    const data = Buffer.concat([
      challenge,
      applicationBuf,
      Buffer.from([keyHandle.length]),
      keyHandle,
      length,
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);

    let chunks = this.splits(maxLength, data);

    let lastResponse = await this.transport.send(
      0xe0,
      0x02,
      0x00,
      0x00,
      chunks.shift()
    );

    for (let i = 0; i < chunks.length; i++) {
      lastResponse = await this.transport.send(
        0xe0,
        0x02,
        0x80,
        0x00,
        chunks[i]
      );
    }
    const userPresence = lastResponse.slice(0, 1);
    const counter = lastResponse.slice(1, 5);
    const signature = lastResponse.slice(5).toString("hex");
    return {
      userPresence,
      counter,
      signature,
      rawResponse: lastResponse.toString("hex")
    };
  }

  async generateKeyComponent(
    path: number[],
    isWrappingKey: boolean
  ): Promise<*> {
    const data = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);
    let p1 = 0x00;
    if (isWrappingKey) {
      p1 = 0x01;
    }
    const response = await this.transport.send(0xe0, 0x44, p1, 0x00, data);
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
