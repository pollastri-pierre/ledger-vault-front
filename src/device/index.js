// @flow
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import VaultDeviceApp from "./VaultDeviceApp";

export default async () => {
  const transport = await LedgerTransportU2F.create();
  return new VaultDeviceApp(transport);
};

export const list = async () => {
  // const transport = await LedgerTransportU2F.create();
  // return new VaultDeviceApp(transport);
  const descriptors = await LedgerTransportU2F.list();
  console.log(descriptors);
};

export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];
