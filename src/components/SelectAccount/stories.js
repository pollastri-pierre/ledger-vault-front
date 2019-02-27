/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { genAccounts, genMembers } from "data/mock-entities";

import SelectAccount from "components/SelectAccount";

const members = genMembers(40);
const accounts = genAccounts(10, { members });

storiesOf("selects", module).add("SelectAccount", () => (
  <SelectAccount
    autoFocus
    openMenuOnFocus
    accounts={accounts}
    value={null}
    onChange={action("onChange")}
  />
));
