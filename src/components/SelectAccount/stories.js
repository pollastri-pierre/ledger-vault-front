/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { genAccounts } from "data/mock-entities";

import SelectAccount from "components/SelectAccount";

const accounts = genAccounts(10, "seed");

storiesOf("Components/selects", module).add("SelectAccount", () => (
  <SelectAccount
    autoFocus
    openMenuOnFocus
    accounts={accounts}
    value={null}
    onChange={action("onChange")}
  />
));
