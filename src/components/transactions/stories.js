/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";

import { delay } from "utils/promise";
import RestlayProvider from "restlay/RestlayProvider";
import Modal from "components/base/Modal";
import TransactionDetails from "components/transactions/TransactionDetails";

import { genUsers, genAccounts, genTransactions } from "data/mock-entities";

const users = genUsers(1);
const accounts = genAccounts(1, { users });
const transactions = genTransactions(1, { accounts, users });

const fakeNetwork = async url => {
  await delay(500);
  if (url.startsWith("/people")) {
    return users[0];
  }
  if (url.startsWith("/transactions/1/account")) {
    return {
      transaction: transactions[0],
      account: accounts[0],
    };
  }
  throw new Error(`invalid url: ${url}`);
};

storiesOf("entities/Transaction", module)
  .addDecorator(StoryRouter())
  .add("Transaction details", () => (
    <RestlayProvider network={fakeNetwork}>
      <Modal transparent isOpened>
        <TransactionDetails
          match={{ params: { transactionId: 1 } }}
          history={[]}
        />
      </Modal>
    </RestlayProvider>
  ));
