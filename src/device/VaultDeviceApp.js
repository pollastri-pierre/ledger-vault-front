// @flow
import type Transport from "@ledgerhq/hw-transport";
import invariant from "invariant";
import { VALIDATION_PATH } from "device";
import type { Operation, Account } from "data/types";

export default class VaultDeviceApp {
  transport: Transport<*>;
  constructor(transport: Transport<*>) {
    this.transport = transport;
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
    signature: string
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
    agentRole: string,
    keyHandleInHex: boolean
  ): Promise<{
    userPresence: *,
    counter: *,
    signature: string
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
    console.log(data);
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
    // console.log(response);
    return response;
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

  async approveOperation(
    operation: Operation,
    account: Account,
    nonce: string
  ): Promise<{
    nonce: string
  }> {
    //TODO use Transaction object to create a useful summary
    const TxSummary = "From x yo y";

    const data = Buffer.concat([
      Buffer.from([0x01]), // version
      Buffer.from(nonce),
      Buffer.from([0x02]), // operation type=operation
      Buffer.from([TxSummary.length]),
      Buffer.from(TxSummary),
      Buffer.from([operation.transaction.outputs[0].address.length]),
      Buffer.from(operation.transaction.outputs[0].address || ""),
      Buffer.from([account.name.length]),
      Buffer.from(account.name),
      Buffer.from([1]), // fees ammount
      Buffer.from([operation.fees.amount]),
      Buffer.from([1]), // amount length
      Buffer.from([operation.price.amount])
    ]);

    return await this.validateVaultOperation(VALIDATION_PATH, data);
  }

  async approveAccount(account: Account, nonce: string): Promise<*> {
    const Timelock = Buffer.alloc(4);
    Timelock.writeUInt32BE(3, 0);

    const operation = Buffer.concat([
      Buffer.from([0x01]), // version
      Buffer.from(nonce, "hex"), // nonce
      Buffer.from([0x01]), // operation type = account
      Buffer.from([account.members.length]),
      Buffer.from([account.security_scheme.quorum]),
      Timelock,
      Buffer.from([0x00]),
      Buffer.from([account.name.length]),
      Buffer.from(account.name),
      Buffer.from([account.currency.family.length]),
      Buffer.from(account.currency.family)
    ]);

    return await this.validateVaultOperation(VALIDATION_PATH, operation);
  }
  async validateVaultOperation(path: number[], operation: Buffer) {
    let offset = 64;
    const paths = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(derivation, 0);
        return buf;
      })
    ]);

    const LengthOperation = Buffer.alloc(2);
    LengthOperation.writeInt16BE(operation.length, 0);

    const data = Buffer.concat([paths, LengthOperation, operation]);
    // we first send an APDU with the operation length and the first chunk
    console.log(data);
    await this.transport.send(0xe0, 0x45, 0x00, 0x00, data);

    // // then we send the others chunks
    // let response;
    // while (offset < operation.length) {
    //   const remaining = operation.length - offset;
    //   const chunkSize = remaining < 64 ? remaining : 64;
    //   const chunk = Buffer.alloc(chunkSize);
    //   operation.copy(chunk, 0, offset, offset + chunkSize);
    //   offset += chunkSize;
    //   console.log(chunk);
    //   response = await this.transport.send(0xe0, 0x45, 0x80, 0x00, chunk);
    // }

    // return response;
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
    const signature = response.slice(pubKeyLength + 1);
    return { pubKey, signature };
  }
}
