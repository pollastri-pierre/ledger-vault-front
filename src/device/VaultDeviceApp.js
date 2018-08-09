// @flow
import type Transport from "@ledgerhq/hw-transport";
import invariant from "invariant";

export default class VaultDeviceApp {
  transport: Transport<*>;
  constructor(transport: Transport<*>, scrambleKey: string = "v1+") {
    this.transport = transport;
    this.transport.debug = true;
    transport.setScrambleKey(scrambleKey);
  }

  async getFirmwareInfo() {
    const res = await this.transport.send(0xe0, 0x01, 0x00, 0x00);
    const byteArray = [...res];
    const data = byteArray.slice(0, byteArray.length - 2);
    const targetIdStr = Buffer.from(data.slice(0, 4));
    const targetId = targetIdStr.readUIntBE(0, 4);
    const seVersionLength = data[4];
    const seVersion = Buffer.from(
      data.slice(5, 5 + seVersionLength)
    ).toString();
    const flagsLength = data[5 + seVersionLength];
    const flags = Buffer.from(
      data.slice(5 + seVersionLength + 1, 5 + seVersionLength + 1 + flagsLength)
    ).toString();

    const mcuVersionLength = data[5 + seVersionLength + 1 + flagsLength];
    let mcuVersion = Buffer.from(
      data.slice(
        7 + seVersionLength + flagsLength,
        7 + seVersionLength + flagsLength + mcuVersionLength
      )
    );
    if (mcuVersion[mcuVersion.length - 1] === 0) {
      mcuVersion = mcuVersion.slice(0, mcuVersion.length - 1);
    }
    mcuVersion = mcuVersion.toString();

    if (!seVersionLength) {
      return {
        targetId,
        seVersion: "0.0.0",
        flags: "",
        mcuVersion: ""
      };
    }

    return { targetId, seVersion, flags, mcuVersion };
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
    invariant(
      challenge.length === 32,
      "challenge hex is expected to have 32 bytes"
    );
    const applicationBuf = Buffer.from(application, "hex");
    invariant(
      applicationBuf.length === 32,
      "application hex is expected to have 32 bytes"
    );

    // const instanceName = location.pathname.split("/")[1];
    // const instanceReference = location.pathname.split("/")[1];
    // const instanceUrl = "vault.ledger.fr";
    // const agentRole = "Administrator";

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
    // const attestationSignature = lastResponse.slice(i, ++i)[0];
    // const signature = lastResponse.slice(i).toString("hex");
    return {
      u2f_register: lastResponse.slice(0, lastResponse.length - 2),
      keyHandle: keyHandle,
      rfu,
      pubKey
    };
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

    let chunks = [data];
    if (maxLength < data.length) {
      chunks = this.splits(maxLength, data);
    }

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
    const signature = lastResponse
      .slice(5, lastResponse.length - 2)
      .toString("hex");
    return {
      userPresence,
      counter,
      signature,
      rawResponse: lastResponse
        .slice(0, lastResponse.length - 2)
        .toString("hex")
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
    attestation: Buffer,
    scriptHash: number = 0x00
  ): Promise<*> {
    const dataDerivation = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);

    const lengthAttestation = Buffer.alloc(2);
    lengthAttestation.writeUInt16BE(attestation.length, 0);

    const maxLength = 150;

    const dataBuffer = Buffer.concat([
      dataDerivation,
      pubKey,
      lengthAttestation,
      attestation
    ]);
    let chunks = [dataBuffer];
    if (maxLength < dataBuffer.length) {
      chunks = this.splits(maxLength, dataBuffer);
    }
    let lastResponse = await this.transport.send(
      0xe0,
      0x42,
      0x00,
      scriptHash,
      chunks.shift()
    );

    for (let i = 0; i < chunks.length; i++) {
      lastResponse = await this.transport.send(
        0xe0,
        0x42,
        0x80,
        scriptHash,
        chunks[i]
      );
    }
    return lastResponse;
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

  async getAttestationCertificate(): Promise<Buffer> {
    const response = await this.transport.send(0xe0, 0x41, 0x00, 0x00);
    return response.slice(0, response.length - 2);
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
    const pubKey = response
      .slice(1, pubKeyLength + 1)
      .toString("hex")
      .toUpperCase();
    const signature = response.slice(pubKeyLength + 1, response.length - 2);
    return { pubKey, signature };
  }
}
