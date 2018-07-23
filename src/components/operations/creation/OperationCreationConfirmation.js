//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";
import type { Account } from "data/types";

const styles = {
  root: {
    padding: "0 40px"
  },
  warningMsg: {
    fontSize: 11,
    color: "#767676",
    lineHeight: 1.82,
    marginTop: 15
  }
};

function OperationCreationConfirmation(props: {
  details: {
    amount: number,
    fees: number,
    address: string
  },
  estimatedFees: number,
  account: Account,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string }
}) {
  const { details, t, account, classes, estimatedFees } = props;
  return (
    <div className={classes.root}>
      <OverviewOperation
        hash={details.address}
        amount={details.amount}
        account={account}
      />
      <div>
        <LineRow label="account to debit">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="confirmation fees">
          <Amount account={account} value={estimatedFees} />
        </LineRow>
        <LineRow label="Total spent">
          <Amount account={account} value={details.amount} strong />
        </LineRow>
      </div>
      <div className={classes.warningMsg}>
        {t("newOperation:confirmation.desc")}
      </div>
    </div>
  );
}

export default withStyles(styles)(translate()(OperationCreationConfirmation));
