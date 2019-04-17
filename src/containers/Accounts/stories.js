/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import schema from "data/schema";
import { denormalize } from "normalizr-gre";
import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import keyBy from "lodash/keyBy";
import Modal from "components/base/Modal";
import AccountDetails from "containers/Accounts/AccountDetails";

import { genAccounts, genUsers } from "data/mock-entities";
import requests from "data/mock-requests.json";

const users = genUsers(10);
const accounts = genAccounts(1, { users });

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/accounts")) {
    const account = accounts[0];
    account.tx_approval_steps.forEach((rule, i) => {
      const a = denormalize(rule.group, schema.Group, {
        users: keyBy(users, "id"),
      });
      account.tx_approval_steps[i].group = a;
    });
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
      <AccountDetails match={{ params: { accountId: 1 } }} history={[]} />
    </Modal>
  </RestlayProvider>
));
