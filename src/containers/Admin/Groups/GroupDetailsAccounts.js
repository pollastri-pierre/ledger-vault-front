// @flow
import React, { PureComponent } from "react";
import type { Account } from "data/types";
import connectData from "restlay/connectData";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import AccountsInGroupQuery from "api/queries/AccountsInGroupQuery";
import AccountName from "components/AccountName";
import SpinnerCard from "components/spinners/SpinnerCard";
import Text from "components/base/Text";
import Box from "components/base/Box";

type Props = {
  accounts: Account[]
  // group: Group
};

class GroupDetailsAccounts extends PureComponent<Props> {
  render() {
    const { accounts } = this.props;
    return (
      <Box grow style={{ overflow: "auto" }} flow={20}>
        {accounts.map(a => (
          <Box key={a.id} noShrink flow={3}>
            <AccountName account={a} />
            <Text small color="grey">
              <CurrencyAccountValue
                account={a}
                value={a.balance}
                erc20Format={a.account_type === "ERC20"}
              />
            </Text>
          </Box>
        ))}
      </Box>
    );
  }
}

const RenderLoading = () => <SpinnerCard />;

export default connectData(GroupDetailsAccounts, {
  RenderLoading,
  queries: {
    accounts: AccountsInGroupQuery
  },
  propsToQueryParams: props => ({
    groupId: props.group.id
  })
});
