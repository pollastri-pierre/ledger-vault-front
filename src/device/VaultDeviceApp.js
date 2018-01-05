// @flow
import type LedgerComm from "ledgerco/lib/LedgerComm";
import invariant from "invariant";

export default class VaultDeviceApp {
  comm: LedgerComm;
  constructor(comm: LedgerComm) {
    this.comm = comm;
    comm.setScrambleKey("v1+");
  }

  // TODO add this send in LedgerComm
  send = async (
    cla: number,
    ins: number,
    p1: number,
    p2: number,
    data: Buffer
  ): Promise<Buffer> =>
    Buffer.from(
      await this.comm.exchange(
        Buffer.concat([
          Buffer.from([cla, ins, p1, p2]),
          Buffer.from([data.length]),
          data
        ]).toString("hex"),
        [0x9000]
      ),
      "hex"
    );

  async authenticate(
    challenge: string,
    application: string,
    keyHandle: string,
    instanceName: string,
    instanceReference: string,
    instanceURL: string,
    agentRole: string
  ): Promise<{
    userPresence: *,
    counter: *,
    signature: string
  }> {
    const challengeBuf = Buffer.from(challenge, "hex");
    invariant(
      challengeBuf.length === 32,
      "challenge hex is expected to have 32 bytes"
    );
    const applicationBuf = Buffer.from(application, "hex");
    invariant(
      applicationBuf.length === 32,
      "application hex is expected to have 32 bytes"
    );
    const keyHandleBuf = Buffer.from(keyHandle);
    const instanceNameBuf = Buffer.from(instanceName);
    const instanceReferenceBuf = Buffer.from(instanceReference);
    const instanceURLBuf = Buffer.from(instanceURL);
    const agentRoleBuf = Buffer.from(agentRole);
    const data = Buffer.concat([
      challengeBuf,
      applicationBuf,
      Buffer.from([keyHandleBuf.length]),
      keyHandleBuf,
      Buffer.from([instanceNameBuf.length]),
      instanceNameBuf,
      Buffer.from([instanceReferenceBuf.length]),
      instanceReferenceBuf,
      Buffer.from([instanceURLBuf.length]),
      instanceURLBuf,
      Buffer.from([agentRoleBuf.length]),
      agentRoleBuf
    ]);
    const response = await this.send(0xe0, 0x02, 0x03, 0x00, data);
    const userPresence = response.slice(0, 1);
    const counter = response.slice(1, 5);
    const signature = response.slice(5).toString("hex");
    return { userPresence, counter, signature };
  }

  async getPublicKey(
    path: number[]
  ): Promise<{
    pubKey: string,
    signature: string
  }> {
    const data = Buffer.concat([
      Buffer.from([path.length]),
      ...path.map(derivation => {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(derivation, 0);
        return buf;
      })
    ]);
    const response = await this.send(0xe0, 0x02, 0x03, 0x00, data);
    const pubKeyLength = response.slice(0, 1)[0];
    const pubKey = response.slice(1, pubKeyLength + 1).toString("hex");
    const signature = response.slice(pubKeyLength + 1).toString("hex");
    return { pubKey, signature };
  }
}
