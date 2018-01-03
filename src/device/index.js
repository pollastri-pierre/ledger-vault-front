// @flow
import LedgerCommU2F from "ledgerco/lib/LedgerCommU2F";
import VaultDeviceApp from "./VaultDeviceApp";
export default async () => {
  const comm = await LedgerCommU2F.create_async();
  return new VaultDeviceApp(comm);
};
