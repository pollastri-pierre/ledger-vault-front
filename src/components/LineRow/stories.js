/* eslint-disable react/prop-types */
// @flow

import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import { genMembers, genAccounts } from "data/mock-entities";
import type { Account, User } from "data/types";

import LineRow from "components/LineRow";
import AccountName from "components/AccountName";
import Amount from "components/Amount";
import DateFormat from "components/DateFormat";
import Box from "components/base/Box";
import EditableField from "components/EditableField";

const members: User[] = genMembers(10);
const accounts: Account[] = genAccounts(3, { members });

const account: Account = accounts[0];

storiesOf("other", module).add("LineRow", () => <Wrapper />);

type State = {
  username: string,
};
class Wrapper extends Component<*, State> {
  state = {
    username: account.name,
  };

  onEditUsername = (username: string) => {
    this.setState({ username });
  };

  render() {
    const { username } = this.state;
    return (
      <Box p={40}>
        <LineRow label="Account">
          <AccountName account={account} />
        </LineRow>
        <LineRow label="Balance">
          <Amount
            account={account}
            value={account.balance}
            strong
            erc20Format={account.account_type === "ERC20"}
          />
        </LineRow>
        <LineRow label="Date">
          <DateFormat date={account.created_on} />
        </LineRow>
        <LineRow label="Editable Name">
          <EditableField value={username} onChange={this.onEditUsername} />
        </LineRow>
      </Box>
    );
  }
}
