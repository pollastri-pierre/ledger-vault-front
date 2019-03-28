/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import UserCreationFlow from "components/UserCreationFlow";

const fakeNetwork = async url => {
  await delay(1e3);
  console.log(url);
  throw new Error("invalid url");
};

storiesOf("flows", module).add("User creation", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <UserCreationFlow />
    </Modal>
  </RestlayProvider>
));
