//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import type { Account } from "data/types";

const styles = {
  root: {
    padding: "0 40px",
  },
  warningMsg: {
    fontSize: 11,
    color: "#767676",
    lineHeight: 1.82,
    marginTop: 30,
  },
};

function OperationCreationConfirmation(props: {
  details: {
    amount: number,
    fees: number,
    address: string,
  },
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
}) {
  const { details, account, classes } = props;
  return (
    <div className={classes.root}>
      <OverviewOperation
        hash={details.address}
        amount={details.amount}
        account={account}
        rate={account.currencyRate}
      />
      <div>
        <LineRow label="account to debit">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="confirmation fees">
          <Amount account={account} value={details.fees} rate={account.currencyRate} />
        </LineRow>
        <LineRow label="Total spent">
          <Amount account={account} value={details.amount} rate={account.currencyRate} strong />
        </LineRow>
      </div>
      <div className={classes.warningMsg}>
        A new operation request will be created. Funds will not be spent until the security scheme
        of the account is satisfied
      </div>
    </div>
  );
}

export default withStyles(styles)(OperationCreationConfirmation);
