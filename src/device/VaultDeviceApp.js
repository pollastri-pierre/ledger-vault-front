// @flow
import type LedgerComm from "ledgerco/lib/LedgerComm";

export default class VaultDeviceApp {
  comm: LedgerComm;
  constructor(comm: LedgerComm) {
    this.comm = comm;
  }
  async authenticate(email: string): Promise<string> {
    console.warn(
      "NOT IMPLEMENTED. use email, exchange with server & device",
      email
    );
    throw new Error("Auth Not Implemented");
  }
  async register(email: string): Promise<string> {
    console.warn(
      "NOT IMPLEMENTED. use email, exchange with server & device",
      email
    );
    throw new Error("Register Not Implemented");
  }
}
