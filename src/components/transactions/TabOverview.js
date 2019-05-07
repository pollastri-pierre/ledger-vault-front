// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import TransactionStatus from "components/TransactionStatus";
import Copy from "components/base/Copy";
import Box from "components/base/Box";
import type { Transaction, Account } from "data/types";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import OverviewTransaction from "../OverviewTransaction";
import Amount from "../Amount";

const styles = {
  transactionList: {
    marginTop: "8px",
  },
};

type Props = {
  transaction: Transaction,
  account: Account,
  classes: Object,
};

class TabOverview extends Component<Props> {
  render() {
    const { transaction, account, classes } = this.props;
    return (
      <div>
        <OverviewTransaction
          amount={transaction.amount || transaction.price.amount}
          account={account}
          transactionType={transaction.type}
        />
        <div className={classes.transactionList}>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.recipient" />}
          >
            <Copy text={transaction.recipient} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.identifier" />}
          >
            {transaction.transaction ? (
              <Copy text={transaction.transaction.hash} />
            ) : (
              "N/A"
            )}
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.status" />}
          >
            <TransactionStatus transaction={transaction} />
          </LineRow>

          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.account" />}
          >
            <Box align="flex-end">
              <AccountName account={account} />
            </Box>
          </LineRow>
          <LineRow label={<Trans i18nKey="transactionDetails:overview.fees" />}>
            <Amount account={account} value={transaction.fees} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.total" />}
          >
            <Amount
              account={account}
              value={transaction.amount || transaction.price.amount}
              strong
              erc20Format={account.account_type === "ERC20"}
            />
          </LineRow>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TabOverview);
