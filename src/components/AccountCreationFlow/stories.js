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
    "/accounts?status=APPROVED&status=PENDING&status=PENDING_UPDATE&status=PENDING_UPDATE_VIEW_ONLY&status=VIEW_ONLY&pageSize=-1"
  ) {
    return wrapConnection(accounts);
  }
  if (url.startsWith("/people")) {
    return wrapConnection(users);
  }
  if (url.startsWith("/groups")) {
    return wrapConnection(
      denormalize(groups.map(g => g.id), [schema.Group], {
        users: keyBy(users, "id"),
        groups: keyBy(groups, "id"),
      }),
    );
  }
  if (url.startsWith("/requests")) {
    return { id: 42 };
  }
  if (url.startsWith("/accounts")) {
    const acc = accounts[0];
    acc.tx_approval_steps = [
      {
        quorum: 2,
        group: denormalize(groups[0].id, schema.Group, {
          users: keyBy(users, "id"),
          groups: keyBy(groups, "id"),
        }),
      },
    ];
    // acc.status = "VIEW_ONLY";
    return acc;
  }
  throw new Error("invalid url");
};

storiesOf("flows", module).add("Account creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <AccountCreationFlow match={{ params: {} }} />
    </Modal>
  </RestlayProvider>
));

storiesOf("flows", module).add("Account Edit", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <AccountCreationFlow match={{ params: { accountId: 1 } }} />
    </Modal>
  </RestlayProvider>
));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
