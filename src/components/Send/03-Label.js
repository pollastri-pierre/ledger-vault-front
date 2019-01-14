// @flow
import React, { PureComponent, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { translate, Trans } from "react-i18next";

import type { Account, Translate } from "data/types";
import type { WalletBridge } from "bridge/types";
import { TextField } from "components";
import DialogButton from "components/buttons/DialogButton";
import SendLayout from "./SendLayout";

type Props<Transaction> = {
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>,
  onTabChange: (SyntheticInputEvent<*>, number) => void,
  t: Translate
};
type State = {};

const styles = {
  label: {
    marginBottom: 20
  },
  comment: {
    marginTop: 5
  },
  noteContainer: {
    marginTop: 10
  }
};
class SendLabel extends PureComponent<Props<*>, State> {
  updateLabel = (e: SyntheticEvent<HTMLInputElement>) => {
    const { account, transaction, bridge, onChangeTransaction } = this.props;
    onChangeTransaction(
      bridge.editTransactionLabel(account, transaction, e.currentTarget.value)
    );
  };

  updateNote = (e: SyntheticEvent<HTMLInputElement>) => {
    const { account, transaction, bridge, onChangeTransaction } = this.props;
    onChangeTransaction(
      bridge.editTransactionNote(account, transaction, e.currentTarget.value)
    );
  };

  onChangeTab = e => {
    // TODO: re-evaluate this tabIndex system
    this.props.onTabChange(e, 3);
  };

  render() {
    const { account, bridge, transaction, classes, t } = this.props;
    const label = bridge.getTransactionLabel(account, transaction);
    const note = bridge.getTransactionNote(account, transaction);
    return (
      <SendLayout
        paddedHorizontal
        content={
          <Fragment>
            <TextField
              classes={{ root: classes.label }}
              fullWidth
              value={label}
              placeholder={t("send:label.title")}
              onChange={this.updateLabel}
            />
            <div className={classes.noteContainer} />
            <TextField
              classes={{ root: classes.comment }}
              placeholder={t("send:label.note")}
              value={note}
              fullWidth
              onChange={this.updateNote}
            />
          </Fragment>
        }
        footer={
          <DialogButton highlight right onTouchTap={this.onChangeTab}>
            <Trans i18nKey="common:continue" />
          </DialogButton>
        }
      />
    );
  }
}

export default withStyles(styles)(translate()(SendLabel));
