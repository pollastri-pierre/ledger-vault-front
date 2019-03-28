/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import AccountDetails from "containers/Admin/Accounts/AccountDetails";

import { genAccounts } from "data/mock-entities";
import requests from "data/mock-requests.json";

const accounts = genAccounts(1);

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/accounts")) {
    const account = accounts[0];
    return {
      ...account,
      last_request: requests.find(r => r.type === "CREATE_ACCOUNT"),
    };
  }
  throw new Error("invalid url");
};

storiesOf("Entity-Request modals", module).add("Account", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <AccountDetails match={{ params: { groupId: 1 } }} history={[]} />
    </Modal>
  </RestlayProvider>
));
