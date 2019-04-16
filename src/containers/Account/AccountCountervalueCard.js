// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";

import CounterValue from "components/CounterValue";
import Card from "components/base/Card";
import CardField from "components/CardField";
import Text from "components/base/Text";
import { Label } from "components/base/form";
import type { Account } from "data/types";

type Props = {
  account: Account,
};

class AccountCountervalueCard extends Component<Props> {
  render() {
    const { account } = this.props;
    const isERC20Token = account.account_type === "ERC20";
    return (
      <Card style={{ flex: 1 }}>
        <Label>
          <Trans i18nKey="accountView:countervalue" />
        </Label>
        <CardField>
          <CounterValue
            value={account.balance}
            fromAccount={account}
            renderNA={
              isERC20Token ? (
                <Text>
                  <Trans i18nKey="accountView:erc20NoCountervalue" />
                </Text>
              ) : null
            }
          />
        </CardField>
      </Card>
    );
  }
}

export default AccountCountervalueCard;
