/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import AccountsMenu from "containers/Menu/AccountsMenu";
import { genAccounts, genUsers } from "data/mock-entities";

const users = genUsers(40);
const accounts = genAccounts(10, { users });
const match = { url: "mock" };

storiesOf("other", module).add("Menu", () => (
  <BrowserRouter>
    <AccountsMenu accounts={accounts} match={match} />
  </BrowserRouter>
));
