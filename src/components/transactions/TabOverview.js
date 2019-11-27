// @flow
import React, { Component } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import TransactionStatus from "components/TransactionStatus";
import Copy from "components/base/Copy";
import Box from "components/base/Box";
import NotApplicableText from "components/base/NotApplicableText";
import NextRequestButton from "components/NextRequestButton";
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
    const note = transaction.notes.length ? transaction.notes[0] : null;
    const isRipple = account.account_type === "Ripple";

    return (
      <div>
        <OverviewTransaction
          amount={transaction.amount || transaction.price.amount}
          account={account}
          transactionType={transaction.type}
        />
        <div className={classes.transactionList}>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.identifier" />}
          >
            {transaction.tx_hash ? (
              <Copy text={transaction.tx_hash} />
            ) : (
              <NotApplicableText inline />
            )}
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.recipient" />}
          >
            <Copy text={transaction.recipient} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.status" />}
          >
            <Box flow={10} horizontal align="center">
              <TransactionStatus transaction={transaction} />
              {transaction.status === "APPROVED" &&
                transaction.last_request && (
                  <NextRequestButton request={transaction.last_request} />
                )}
            </Box>
          </LineRow>

          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.account" />}
          >
            <Box align="flex-end">
              <AccountName account={account} />
            </Box>
          </LineRow>

          {isRipple && (
            <LineRow
              label={
                <Trans i18nKey="transactionCreation:steps.amount.destinationTag" />
              }
            >
              {transaction.destination_tag}
            </LineRow>
          )}
          {note && note.title && (
            <LineRow
              label={
                <Trans i18nKey="transactionCreation:steps.note.noteTitle" />
              }
            >
              {note.title}
            </LineRow>
          )}
          {note && note.content && (
            <LineRow
              label={
                <Trans i18nKey="transactionCreation:steps.note.noteContent" />
              }
            >
              {note.content}
            </LineRow>
          )}
          <LineRow label={<Trans i18nKey="transactionDetails:overview.fees" />}>
            <Amount disableERC20 account={account} value={transaction.fees} />
          </LineRow>
          <LineRow
            label={<Trans i18nKey="transactionDetails:overview.total" />}
          >
            <Amount
              account={account}
              value={transaction.amount || transaction.price.amount}
              strong
            />
          </LineRow>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TabOverview);
