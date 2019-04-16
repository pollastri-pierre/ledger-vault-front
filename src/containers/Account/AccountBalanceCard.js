// @flow

import React, { Component } from "react";
import { Trans } from "react-i18next";

import CurrencyAccountValue from "components/CurrencyAccountValue";
import Card from "components/base/Card";
import CardField from "components/CardField";
import DateFormat from "components/DateFormat";
import { Label } from "components/base/form";
import type { Account } from "data/types";

type Props = {
  account: Account,
};

class AccountBalanceCard extends Component<Props> {
  render() {
    const { account } = this.props;
    return (
      <Card style={{ flex: 1 }}>
        <Label>
          <Trans i18nKey="accountView:balance" />
        </Label>
        <CardField label={<DateFormat date={new Date()} />}>
          <CurrencyAccountValue
            account={account}
            value={account.balance}
            erc20Format={account.account_type === "ERC20"}
          />
        </CardField>
      </Card>
    );
  }
}

export default AccountBalanceCard;
