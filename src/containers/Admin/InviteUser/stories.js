/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import RestlayProvider from "restlay/RestlayProvider";
import { delay } from "utils/promise";

import { action } from "@storybook/addon-actions";
import Modal from "components/base/Modal";
import InviteUser from "containers/Admin/InviteUser";

const fakeNetwork = async url => {
  await delay(1e3);
  if (url === "/requests") {
    return { url_id: "c4ab6059-45ab-485b-b1a1-665be5224358", id: 123 };
  }
  throw new Error("invalid url");
};

storiesOf("flows", module).add("Invite user", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal isOpened>
      <InviteUser close={action("close")} />
    </Modal>
  </RestlayProvider>
));
