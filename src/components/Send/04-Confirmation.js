// @flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { WalletBridge } from "bridge/types";
import type { Account } from "data/types";
import { Trans } from "react-i18next";
import LineRow from "components/LineRow";
import AccountName from "components/AccountName";
import OverviewOperation from "components/OverviewOperation";
import Amount from "components/Amount";
import DialogButton from "components/buttons/DialogButton";
import CopyToClipboardButton from "components/CopyToClipboardButton";

import InfoModal from "components/InfoModal";
import SendLayout from "./SendLayout";

const styles = {
  warningMsg: {
    marginTop: 25
  }
};

type Props<Transaction> = {
  classes: { [_: $Keys<typeof styles>]: string },
  account: Account,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  confirmTx: () => void
};

type State = {
  fees: ?number,
  totalSpent: ?number
};

class SendConfirmation extends PureComponent<Props<*>, State> {
  state = {
    fees: null,
    totalSpent: null
  };

  async componentDidMount() {
    const { bridge, account, transaction } = this.props;

    const [fees, totalSpent] = await Promise.all([
      bridge.getFees(account, transaction),
      bridge.getTotalSpent(account, transaction)
    ]);
    this.setState({ fees, totalSpent });
  }

  render() {
    const { account, bridge, transaction, classes, confirmTx } = this.props;
    const { fees, totalSpent } = this.state;

    const amount = bridge.getTransactionAmount(account, transaction);
    const recipient = bridge.getTransactionRecipient(account, transaction);
    const erc20Format = account.account_type === "ERC20";

    return (
      <SendLayout
        paddedHorizontal
        content={
          <Fragment>
            <OverviewOperation
              amount={amount}
              account={account}
              operationType="SEND"
            />
            <div>
              <LineRow label={<Trans i18nKey="send:confirmation.identifier" />}>
                {recipient && <CopyToClipboardButton textToCopy={recipient} />}
              </LineRow>
              <LineRow label={<Trans i18nKey="send:confirmation.account" />}>
                <AccountName account={account} />
              </LineRow>
              <LineRow label={<Trans i18nKey="send:confirmation.fees" />}>
                {fees !== null && <Amount account={account} value={fees} />}
              </LineRow>
              <LineRow
                label={<Trans i18nKey="send:confirmation.total" />}
                tooltipInfoMessage={
                  erc20Format && (
                    <Trans i18nKey="send:confirmation.totalERC20Info" />
                  )
                }
              >
                {totalSpent !== null && (
                  <Amount
                    account={account}
                    value={totalSpent}
                    strong
                    erc20Format={erc20Format}
                  />
                )}
              </LineRow>
            </div>
            <InfoModal className={classes.warningMsg}>
              <Trans i18nKey="send:confirmation.desc" />
            </InfoModal>
          </Fragment>
        }
        footer={
          <DialogButton highlight right onTouchTap={confirmTx}>
            <Trans i18nKey="common:confirm" />
          </DialogButton>
        }
      />
    );
  }
}

export default withStyles(styles)(SendConfirmation);
