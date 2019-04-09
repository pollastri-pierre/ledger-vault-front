/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import UserCreationFlow from "components/UserCreationFlow";

const fakeNetwork = async url => {
  await delay(1e3);
  if (url === "/requests") {
    return { url_id: "c4ab6059-45ab-485b-b1a1-665be5224358", id: 123 };
  }
  throw new Error("invalid url");
};

storiesOf("flows", module).add("User creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <UserCreationFlow />
    </Modal>
  </RestlayProvider>
));
