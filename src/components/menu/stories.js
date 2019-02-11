/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import AccountsMenu from "components/menu/AccountsMenu";
import { genAccounts } from "data/mock-entities";

const accounts = genAccounts(10, "seed");
const match = { url: "mock" };

storiesOf("Components", module).add("Menu", () => (
  <BrowserRouter>
    <AccountsMenu accounts={accounts} match={match} />
  </BrowserRouter>
));
