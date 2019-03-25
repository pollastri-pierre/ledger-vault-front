/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import CreateGroup from "containers/Admin/Groups/CreateGroup";

import { genUsers } from "data/mock-entities";

const users = genUsers(20);

const fakeNetwork = async url => {
  await delay(1e3);
  if (url.startsWith("/people")) {
    return wrapConnection(users);
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

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
