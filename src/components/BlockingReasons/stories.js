/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import BlockingReasons from "components/BlockingReasons";

import { genAccounts } from "data/mock-entities";

import Modal from "components/base/Modal";

const accounts = genAccounts(2);
const mock = [
  {
    type: "Account",
    entity: accounts[0],
    message: "Not enough approvers (3) for quorum (1)",
  },
  {
    type: "Account",
    entity: accounts[1],
    message: "Not enough approvers (3) for quorum (1)",
  },
  {
    type: "Transaction",
    entity: { id: 1 },
    message: "Ongoing transaction",
  },
];

const error = {
  message:
    "We can not let you perform this request or it will break some object in your vault",
  name: "PREVENT_BLOCKING_OBJECT_EXCEPTION",
  blocking_reasons: mock,
};

storiesOf("Others", module).add("BlockingReasons", () => (
  <Modal isOpened>
    <BlockingReasons error={error} />
  </Modal>
));
