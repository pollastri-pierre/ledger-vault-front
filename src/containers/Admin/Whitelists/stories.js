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
import WhitelistEditRequest from "containers/Admin/Whitelists/WhitelistEditRequest";
import requests from "data/mock-requests.json";

import { EntityModalDecorator } from "utils/storybook";

import {
  genWhitelists,
  genUsers,
  genGroups,
  genAccounts,
  genAddresses,
  genRequest,
} from "data/mock-entities";

const users = genUsers(20);
const groups = genGroups(3, { users, status: "ACTIVE" });
const accounts = genAccounts(4);
const whitelists = genWhitelists(10, { users, status: "ACTIVE" });

const fakeNetwork = async url => {
  await delay(100);
  if (url.match(/whitelists\/[^/]*/g)) {
    return whitelists[0];
  }
  if (url.startsWith("/whitelists")) {
    return wrapConnection(whitelists);
  }
  if (url.startsWith("/people")) {
    return wrapConnection(users);
  }
  if (url.match(/groups\/[^/]*\/accounts/g)) {
    return accounts;
  }
  if (url.match(/groups\/[^/]*\/history/g)) {
    return [];
  }
  if (url.match(/\/validation.*/)) {
    const [, address] = /.*\/(.*)$/.exec(url);
    // much secure btc-like address verification
    return { is_valid: address.length >= 24 && address.length <= 35 };
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

storiesOf("entities/Whitelist", module).add("Whitelist edit", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <WhitelistCreationFlow
        match={{ params: { whitelistId: whitelists[0].id } }}
      />
    </Modal>
  </RestlayProvider>
));
storiesOf("entities/Whitelist", module).add("Whitelist diff edit", () => {
  const newAddresses = genAddresses(30);
  const last_request = genRequest("EDIT_WHITELIST", {
    target_type: "WHITELIST",
    status: "PENDING_APPROVAL",
  });
  const whitelist = {
    ...whitelists[0],
    addresses: newAddresses.slice(0, 10),
    last_request: {
      ...last_request,
      edit_data: { addresses: newAddresses.slice(6, 30) },
    },
  };
  return <WhitelistEditRequest whitelist={whitelist} />;
});

storiesOf("entities/Whitelist", module)
  .addDecorator(StoryRouter())
  .addDecorator(EntityModalDecorator("WHITELIST"))
  .add("whitelist details", () => (
    <WhitelistDetails match={{ params: { whitelistId: 0 } }} />
  ));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
