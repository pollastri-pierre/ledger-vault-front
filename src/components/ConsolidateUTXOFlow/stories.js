/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import ConsolidateUTXOFlow from "components/ConsolidateUTXOFlow";
import Modal from "components/base/Modal";
import mockEntities, { genAccounts } from "data/mock-entities";
import schema from "data/schema";
import { denormalize } from "normalizr-gre";
import backendDecorator from "stories/backendDecorator";

const accounts = genAccounts(1);

const edges = mockEntities.utxosArray.map((key) => ({
  node: denormalize(key, schema.Utxo, mockEntities),
  cursor: key.address,
}));

const mock = [
  {
    url: /accounts\/[0-9]+\/addresses\?from=[0-9]+&to=[0-9]+/,
    res: () => [
      {
        address: "mmcXDpCHz5GVjPotUTDSbTpnHQcZLbzKbn", // Bitcoin testNet
        derivation_path: "0/0",
      },
    ],
  },
  {
    url: /^\/accounts\/[0-9]+$/,
    res: () => accounts[0],
  },
  {
    url: /\/utxos\?page=1&pageSize=-1/,
    res: () => ({ edges, pageInfo: { hasNextPage: false } }),
  },
];

storiesOf("components", module)
  .addDecorator(backendDecorator(mock))
  .add("ConsolidateUTXOFlow", () => (
    <Modal transparent isOpened>
      <ConsolidateUTXOFlow
        match={{ params: { accountId: 1, derivation_path: 1 } }}
      />
    </Modal>
  ));
