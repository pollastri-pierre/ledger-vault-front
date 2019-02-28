/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import AccountsMenu from "containers/Menu/AccountsMenu";
import { genAccounts, genMembers } from "data/mock-entities";

const members = genMembers(40);
const accounts = genAccounts(10, { members });
const match = { url: "mock" };

storiesOf("other", module).add("Menu", () => (
  <BrowserRouter>
    <AccountsMenu accounts={accounts} match={match} />
  </BrowserRouter>
));
