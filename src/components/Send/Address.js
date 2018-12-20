//@flow
import React, { PureComponent, Fragment } from "react";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import CryptoAddressPicker from "components/CryptoAddressPicker";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";

const styles = {
  fieldTitle: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase"
  },
  addressPicker: {
    margin: "15px 0"
  }
};

type Props<Transaction> = {
  restlay: RestlayEnvironment,
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  onChangeTransaction: Transaction => void,
  transaction: Transaction,
  bridge: WalletBridge<Transaction>
};
type State = {
  isValid: boolean
};
class SendAddress extends PureComponent<Props<*>, State> {
  state = {
    isValid: true
  };
  onChange = async (recipient: string) => {
    const {
      restlay,
      account: { currency },
      onChangeTransaction,
      bridge,
      transaction,
      account
    } = this.props;
    onChangeTransaction(
      bridge.editTransactionRecipient(account, transaction, recipient)
    );
    if (recipient) {
      const isValid = await bridge.isRecipientValid(
        restlay,
        currency,
        recipient
      );
      this.setState({ isValid });
    }
  };

  render() {
    const { account, bridge, transaction, classes } = this.props;
    const { isValid } = this.state;
    return (
      <Fragment>
        <div className={classes.fieldTitle}>
          <Trans i18nKey="send:details.address.title" />
        </div>
        <CryptoAddressPicker
          id="address"
          onChange={this.onChange}
          value={bridge.getTransactionRecipient(account, transaction)}
          isValid={isValid}
          fullWidth
          inputProps={{ style: { paddingBottom: 15, color: "black" } }}
          className={classes.addressPicker}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(connectData(SendAddress));
