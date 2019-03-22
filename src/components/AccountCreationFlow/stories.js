/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { denormalize } from "normalizr-gre";
import keyBy from "lodash/keyBy";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import schema from "data/schema";
import Modal from "components/base/Modal";
import AccountCreationFlow from "components/AccountCreationFlow";

import { genAccounts, genUsers, genGroups } from "data/mock-entities";

const users = genUsers(20);
const accounts = genAccounts(10, { users });
const groups = genGroups(3, { users });

const fakeNetwork = async url => {
  await delay(1e3);
  if (
    url ===
    "/accounts/status/APPROVED,PENDING,PENDING_UPDATE,PENDING_UPDATE_VIEW_ONLY,VIEW_ONLY"
  ) {
    return accounts;
  }
  if (url.startsWith("/people")) {
    return wrapConnection(users);
  }
  if (url.startsWith("/groups")) {
    return denormalize(groups.map(g => g.id), [schema.Group], {
      users: keyBy(users, "id"),
      groups: keyBy(groups, "id"),
    });
  }
  if (url.startsWith("/requests")) {
    return { id: 42 };
  }
  throw new Error("invalid url");
};

storiesOf("flows", module).add("Account creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <AccountCreationFlow />
    </Modal>
  </RestlayProvider>
));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
