// @flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import type { WalletBridge } from "bridge/types";
import type { Account } from "data/types";
import { Trans } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import LineRow from "components/LineRow";
import AccountName from "components/AccountName";
import OverviewOperation from "components/OverviewOperation";
import Amount from "components/Amount";
import DialogButton from "components/buttons/DialogButton";
import Copy from "components/icons/Copy";
import colors from "shared/colors";

import SendLayout from "./SendLayout";

const styles = {
  warningMsg: {
    fontSize: 11,
    color: colors.steel,
    lineHeight: 1.82,
    marginTop: 15,
    textAlign: "center"
  },
  recipientContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "&:hover $buttonCopy": {
      display: "flex",
      backgroundColor: colors.cream
    }
  },
  recipient: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  buttonCopy: {
    display: "none",
    position: "fixed",
    alignSelf: "flex-end",
    color: colors.ocean,
    fontSize: 11
  },
  copyIcon: {
    marginRight: 3
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
  copied: boolean,
  fees: ?number,
  totalSpent: ?number
};

class SendConfirmation extends PureComponent<Props<*>, State> {
  state = {
    copied: false,
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

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  componentWillUnmount() {
    this._timeout && clearTimeout(this._timeout);
  }

  _timeout: ?TimeoutID = null;

  render() {
    const { account, bridge, transaction, classes, confirmTx } = this.props;
    const { copied, fees, totalSpent } = this.state;

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
                {recipient && (
                  <div className={classes.recipientContainer}>
                    <span className={classes.recipient}>{recipient}</span>
                    <CopyToClipboard text={recipient} onCopy={this.onCopy}>
                      <Button
                        className={classes.buttonCopy}
                        variant="contained"
                        size="small"
                      >
                        {copied ? (
                          <span>
                            <Trans i18nKey="common:copied" />
                          </span>
                        ) : (
                          <Fragment>
                            <div className={classes.copyIcon}>
                              <Copy color={colors.ocean} size={12} />
                            </div>
                            <span>
                              <Trans i18nKey="common:copy" />
                            </span>
                          </Fragment>
                        )}
                      </Button>
                    </CopyToClipboard>
                  </div>
                )}
              </LineRow>
              <LineRow label={<Trans i18nKey="send:confirmation.account" />}>
                <AccountName
                  name={account.name}
                  currencyId={account.currency_id}
                />
              </LineRow>
              <LineRow label={<Trans i18nKey="send:confirmation.fees" />}>
                {fees !== null && <Amount account={account} value={fees} />}
              </LineRow>
              <LineRow label={<Trans i18nKey="send:confirmation.total" />}>
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
            <div className={classes.warningMsg}>
              <Trans i18nKey="send:confirmation.desc" />
            </div>
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
