//@flow
import React, { Component } from "react";
import type { Account } from "data/types";
// import CounterValue from "components/CounterValue";
import Card from "components/Card";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { withStyles } from "@material-ui/core/styles";
import BadgeCurrency from "components/BadgeCurrency";
import EvolutionSince, { TotalBalanceFilters } from "components/EvolutionSince";

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
// const Separator = withStyles(styles)(({ classes }) => (
//   <div className={classes.separator} />
// ));

class AccountCard extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  account: Account,
  index: number,
  filter: string
}> {
  render() {
    const { account, filter, classes, index } = this.props;

    const title = (
      <div>
        <BadgeCurrency currency={account.currency.name} />
        <span>{account.name}</span>
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
            <CurrencyAccountValue account={account} value={account.balance} />
          </div>
          <div className={classes.realcur} />
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountCard);
