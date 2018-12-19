//@flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { Translate } from "data/types";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import AccountName from "components/AccountName";
import OverviewOperation from "components/OverviewOperation";
import Amount from "components/Amount";
import DialogButton from "components/buttons/DialogButton";

import SendLayout from "./SendLayout";

type Props<Transaction> = {
  classes: { [_: $Keys<typeof styles>]: string },
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  confirmTx: () => void,
  t: Translate,
};

type State = {};

const styles = {
  warningMsg: {
    fontSize: 11,
    color: "#767676",
    lineHeight: 1.82,
    marginTop: 15
  }
};
class SendConfirmation extends PureComponent<Props<*>, State> {
  render() {

    const { account, bridge, transaction, classes, confirmTx } = this.props;
    const amount = bridge.getTransactionAmount(account, transaction);
    const recipient = bridge.getTransactionRecipient(account, transaction);
    return (
      <SendLayout
        header={null}
        content={
          <Fragment>
            <OverviewOperation
              amount={amount}
              account={account}
              operationType="SEND"
            />
            <div>
              <LineRow label="Identifier">
                {recipient && <span>{recipient}</span>}
              </LineRow>
              <LineRow label="account to debit">
                <AccountName
                  name={account.name}
                  currencyId={account.currency.name}
                />
              </LineRow>
              <LineRow label="confirmation fees">
                <Amount account={account} value={transaction.estimatedFees} />
              </LineRow>
              <LineRow label="Total spent">
                <Amount account={account} value={amount} strong />
              </LineRow>
            </div>
            <div className={classes.warningMsg}>
              <Trans i18nKey="send:confirmation.desc" />
            </div>
          </Fragment>
        }
        footer={<DialogButton highlight right onTouchTap={confirmTx}>
          <Trans i18nKey="common:confirm" />
        </DialogButton>}
      />
    );
  }
}

export default withStyles(styles)(SendConfirmation);
