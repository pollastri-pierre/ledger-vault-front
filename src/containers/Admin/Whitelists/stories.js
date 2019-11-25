/* eslint-disable react/prop-types */

import React from "react";
import StoryRouter from "storybook-react-router";
import { storiesOf } from "@storybook/react";

import schema from "data/schema";
import keyBy from "lodash/keyBy";
import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import { denormalize } from "normalizr-gre";
import WhitelistCreationFlow from "components/WhitelistCreationFlow";
import WhitelistDetails from "containers/Admin/Whitelists/WhitelistDetails";
import requests from "data/mock-requests.json";

import { EntityModalDecorator } from "utils/storybook";

import { genUsers, genGroups, genAccounts } from "data/mock-entities";

const users = genUsers(20);
const groups = genGroups(3, { users, status: "ACTIVE" });
const accounts = genAccounts(4);

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/people")) {
    return wrapConnection(users);
  }
  if (url.match(/groups\/[^/]*\/accounts/g)) {
    return accounts;
  }
  if (url.match(/groups\/[^/]*\/history/g)) {
    return [];
  }
  if (url.startsWith("/groups")) {
    const group = denormalize(
      groups.map(g => g.id),
      [schema.Group],
      {
        users: keyBy(users, "id"),
        groups: keyBy(groups, "id"),
      },
    )[0];
    const g = {
      ...group,
      last_request: requests.find(r => r.type === "CREATE_GROUP"),
    };
    g.status = "ACTIVE";
    g.last_request.status = "PENDING";
    return g;
  }
  throw new Error("invalid url");
};

storiesOf("entities/Whitelist", module).add("Whitelist creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <WhitelistCreationFlow match={{ params: {} }} />
    </Modal>
  </RestlayProvider>
));

storiesOf("entities/Group", module).add("Whitelist edit", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <WhitelistCreationFlow match={{ params: { whitelistId: 1 } }} />
    </Modal>
  </RestlayProvider>
));

storiesOf("entities/Whitelist", module)
  .addDecorator(StoryRouter())
  .addDecorator(EntityModalDecorator("WHITELIST"))
  .add("Group details", () => (
    <WhitelistDetails match={{ params: { whitelistId: 0 } }} />
  ));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
