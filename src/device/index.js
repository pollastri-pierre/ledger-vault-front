// @flow
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import VaultDeviceApp from "./VaultDeviceApp";

export default async () => {
  const transport = await LedgerTransportU2F.create();
  return new VaultDeviceApp(transport);
};

export const U2F_PATH = [0x80564c54, 0x80553246];
