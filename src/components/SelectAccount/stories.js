/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { genAccounts, genUsers } from "data/mock-entities";

import SelectAccount from "components/SelectAccount";

const users = genUsers(20);
const accounts = genAccounts(10, { users });

storiesOf("components/form/selects", module).add("SelectAccount", () => (
  <div style={{ width: 300 }}>
    <SelectAccount
      autoFocus
      openMenuOnFocus
      accounts={accounts}
      value={null}
      onChange={action("onChange")}
    />
  </div>
));
