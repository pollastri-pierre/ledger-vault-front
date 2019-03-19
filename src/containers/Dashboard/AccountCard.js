// @flow
import React, { Component } from "react";
import type { Account } from "data/types";
import CounterValue from "components/CounterValue";
import Card from "components/Card";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { withStyles } from "@material-ui/core/styles";
import EvolutionSince, { TotalBalanceFilters } from "components/EvolutionSince";
import AccountName from "components/AccountName";

const styles = {
  card: {
    width: "calc(33% - 20px)",
    marginRight: "20px"
  },
  separator: {
    width: "100%",
    height: "1px",
    backgroundColor: "#eee",
    margin: "20px 0 15px"
  },
  cryptocur: {
    fontSize: "16px",
    marginBottom: 10,
    color: "#000"
  },
  realcur: {
    fontSize: "13px",
    color: "#767676"
  }
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  account: Account,
  index: number,
  filter: string
};

class AccountCard extends Component<Props> {
  render() {
    const { account, filter, classes, index } = this.props;
    const erc20Format = account.account_type === "ERC20";

    const title = (
      <div>
        <AccountName account={account} />
      </div>
    );
    return (
      <Card
        key={account.id}
        title={title}
        dataTest={`account_${index}`}
        className={classes.card}
        link={`account/${account.id}`}
      >
        <EvolutionSince
          value={account.balance}
          valueHistory={account.balance_history}
          filter={TotalBalanceFilters.find(f => f.key === filter)}
        />
        {/* <Separator /> */}
        <div>
          <div className={classes.cryptocur}>
            <CurrencyAccountValue
              account={account}
              value={account.balance}
              erc20Format={erc20Format}
            />
          </div>
          <div className={classes.realcur}>
            <CounterValue
              from={account.currency_id}
              value={account.balance}
              disableCountervalue={erc20Format}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountCard);
