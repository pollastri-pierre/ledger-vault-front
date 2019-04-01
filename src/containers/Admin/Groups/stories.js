/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import schema from "data/schema";
import keyBy from "lodash/keyBy";
import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import { denormalize } from "normalizr-gre";
import CreateGroup from "containers/Admin/Groups/CreateGroup";
import GroupDetails from "containers/Admin/Groups/GroupDetails";
import requests from "data/mock-requests.json";

import { genUsers, genGroups, genAccounts } from "data/mock-entities";

const users = genUsers(20);
const groups = genGroups(3, { users, forceStatus: "PENDING_APPROVAL" });
const accounts = genAccounts(4);

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/people")) {
    return wrapConnection(users);
  }
  if (url.match(/group-mock\/[^/]*\/accounts/g)) {
    return accounts;
  }
  if (url.startsWith("/groups")) {
    const group = denormalize(groups.map(g => g.id), [schema.Group], {
      users: keyBy(users, "id"),
      groups: keyBy(groups, "id"),
    })[0];
    return {
      ...group,
      last_request: requests.find(r => r.type === "CREATE_GROUP"),
    };
  }
  throw new Error("invalid url");
};

storiesOf("flows", module).add("Group Creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <CreateGroup />
    </Modal>
  </RestlayProvider>
));

storiesOf("Entity-Request modals", module).add("Group", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <GroupDetails match={{ params: { groupId: 1 } }} history={[]} />
    </Modal>
  </RestlayProvider>
));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
