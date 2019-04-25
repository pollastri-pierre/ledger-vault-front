/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import ReceiveFlow from "components/ReceiveFlow";

import { genAccounts, genUsers } from "data/mock-entities";

const users = genUsers(20);
const accounts = genAccounts(20, { users });
const getAddressInfo = {
  admin_uid:
    "047F2ACCB0B06F77F98D37B358062CA2E17E042C48EC3D58355A52CF086BFA27C7E80B18D18283537D595DC96438CAC1943AA5DFDBF6DB079BCD68EBD3D2D32670",
  attestation_certificate:
    "RjBEAiBLFVz23XD/e78ahLz7ScWRoGTBb3vdTMgnLJ9T53nruwIgI1wj6XEhsfF5uM0MLlPIvyMV4S5Tk0GTzhuGvx+2HswEit+tVnkE9RTPvtx2K1LXF1V4kVxFpCcT5GtEMnFGxtV6Fk8uzx+4LbINFVdNpfDi2kAwPok3PalK6j1APsBaXUYwRAIgVlz16QQltg8u2Vv6TXvKd2WmIOW+yq4fNaSQ3CpNQagCIEtan/8+O6ynMVjNTe4aqhG5lAY7C998Q+Agb/yeHmEI",
  ephemeral_public_key:
    "041C7CD39BCC781027768E42D87702F48D532484FE47A1C3692415B01FBCB5CF4F2C91A774633A8A8AF2E8F4D6615BB3EA368F63E39206BA397369AE86273C768F",
  wallet_address:
    "Aex+Kcmd2gtWTGWcQp7LVa5lWdqXFwldnAv5c/GHB2hhMIPps0HTjBP+Ku1pNu3hdv9XSPqPs79ndxMkYjjlLYYNFIsAYSzbmkflZjBCtft/SEzF1FM7QGCrQSwpOugXBAlc/b5N6mo=",
};
const fresh_addresses = [
  {
    address: "1MfeDvj5AUBG4xVMrx1xPgmYdXQrzHtW5b",
    derivation_path: "0/2",
    id: 1,
  },
];

const fakeNetwork = async url => {
  await delay(200);
  if (url === "/accounts?status=APPROVED&status=VIEW_ONLY&pageSize=-1") {
    return wrapConnection(accounts);
  }
  if (url.match(/^\/accounts\/[^/]*\/fresh_addresses/)) {
    return fresh_addresses;
  }
  if (url.match(/^\/accounts\/[^/]*\/address\?derivation_path/)) {
    return getAddressInfo;
  }
  throw new Error(`invalid url ${url}`);
};

storiesOf("flows", module).add("Receive Flow", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <ReceiveFlow />
    </Modal>
  </RestlayProvider>
));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
