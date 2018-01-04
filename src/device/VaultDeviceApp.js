// @flow
import type LedgerComm from "ledgerco/lib/LedgerComm";

export default class VaultDeviceApp {
  comm: LedgerComm;
  constructor(comm: LedgerComm) {
    this.comm = comm;
  }
  async authenticate(
    challenge: string
  ): Promise<{
    pub_key: string,
    authentication: string
  }> {
    console.warn(
      "NOT IMPLEMENTED. use email, exchange with server & device",
      challenge
    );
    return { pub_key: "", authentication: "" };
  }
}
