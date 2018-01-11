// @flow
import LedgerCommU2F from "@ledgerhq/hw-comm-u2f";
import VaultDeviceApp from "./VaultDeviceApp";

export default async () => {
  const comm = await LedgerCommU2F.create();
  return new VaultDeviceApp(comm);
};

export const U2F_PATH = [0x80564c54, 0x80553246];
