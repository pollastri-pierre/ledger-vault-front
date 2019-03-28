/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import schema from "data/schema";
import keyBy from "lodash/keyBy";
import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import { denormalize } from "normalizr-gre";
import UserDetails from "containers/Admin/Users/UserDetails";
import requests from "data/mock-requests.json";

import { genUsers, genGroups } from "data/mock-entities";

const users = genUsers(1);
const groups = genGroups(3, { users, status: "PENDING_APPROVAL" });

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/people/1")) {
    users[0].last_request = requests.find(r => r.type === "CREATE_OPERATOR");
    return users[0];
  }
  if (url.startsWith("/groups")) {
    return denormalize(groups.map(g => g.id), [schema.Group], {
      users: keyBy(users, "id"),
      groups: keyBy(groups, "id"),
    })[0];
  }
  throw new Error("invalid url");
};

storiesOf("Entity-Request modals", module).add("User", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <UserDetails match={{ params: { userID: 1 } }} history={[]} />
    </Modal>
  </RestlayProvider>
));
