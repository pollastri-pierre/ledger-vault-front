//@flow
import React, { Component } from "react";
import type { Account } from "../../data/types";
import Card from "../../components/Card";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import BadgeCurrency from "../../components/BadgeCurrency";
import EvolutionSince, {
  TotalBalanceFilters
} from "../../components/EvolutionSince";

const Separator = () => <div className="separator" />;

class AccountCard extends Component<{
  account: Account,
  filter: string
}> {
  render() {
    const { account, filter } = this.props;

    const title = (
      <div>
        <BadgeCurrency currency={account.currency} />
        <span className="uppercase currencyName">{account.name}</span>
      </div>
    );
    return (
      <Card className="account-card" key={account.id} title={title}>
        <EvolutionSince
          value={account.balance}
          valueHistory={account.balance_history}
          filter={TotalBalanceFilters.find(f => f.key === filter)}
        />
        <Separator />
        <div>
          <div className="cryptocur">
            <CurrencyAccountValue account={account} value={account.balance} />
          </div>
          <div className="realcur">
            <CurrencyAccountValue
              account={account}
              value={account.balance}
              countervalue={true}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default AccountCard;
