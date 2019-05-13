/* eslint-disable react/prop-types */

import React from "react";
import BigNumber from "bignumber.js";
import { storiesOf } from "@storybook/react";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import TransactionCreationFlow from "components/TransactionCreationFlow";

import { genAccounts, genUsers } from "data/mock-entities";

const users = genUsers(20);
const accounts = genAccounts(20, { users });

const fakeNetwork = async url => {
  await delay(200);
  if (
    url ===
    "/accounts?status=ACTIVE&status=VIEW_ONLY&status=MIGRATED&status=HSM_COIN_UPDATED&pageSize=-1"
  ) {
    return wrapConnection(accounts);
  }
  if (url.startsWith("/validation")) {
    const [, address] = /.*\/(.*)$/.exec(url);
    // much secure btc-like address verification
    return { is_valid: address.length >= 24 && address.length <= 35 };
  }
  if (url.match(/^\/accounts\/[^/]*\/transactions\/fees/)) {
    const [, accountId] = /^\/accounts\/([^/]*)\/transactions\/fees/.exec(url);
    const account = accounts.find(a => a.id === Number(accountId));
    if (account.account_type === "Ethereum") {
      const fees = {
        gas_price: BigNumber(5000000000),
        gas_limit: BigNumber(21000),
      };
      fees.fees = fees.gas_price.times(fees.gas_limit);
      return fees;
    }
    return {
      fees: BigNumber(4046),
      max_amount: BigNumber(50000000000),
    };
  }
  throw new Error(`invalid url ${url}`);
};

storiesOf("entities/Transaction", module).add("Send", () => (
  <RestlayProvider network={fakeNetwork}>
    <Modal transparent isOpened>
      <TransactionCreationFlow match={{ params: { id: 5 } }} />
    </Modal>
  </RestlayProvider>
));

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
