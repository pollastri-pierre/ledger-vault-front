// @flow
import LedgerTransportU2F from "@ledgerhq/hw-transport-u2f";
import VaultDeviceApp from "./VaultDeviceApp";

export default async () => {
  const transport = await LedgerTransportU2F.create();
  return new VaultDeviceApp(transport);
};

export const U2F_PATH = [0x80564c54, 0x80553246];
export const CONFIDENTIALITY_PATH = [0x80564c54, 0x80434e46];
export const VALIDATION_PATH = [0x80564c54, 0x8056414c];
export const KEY_MATERIAL_PATH = [0x80564c54, 0x804b4559];

// export const APPID_VAULT_BOOTSTRAP = bytes("1e55aaa3241c6f9b630d3a53c6aa6877695fd0e0c6c7bbc0f8eed35bcb43ebe0".decode('hex'))
export const APPID_VAULT_BOOTSTRAP = 1;
