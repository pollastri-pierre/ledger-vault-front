//@flow
import React, { PureComponent, Fragment } from "react";
import type { Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Warning from "components/icons/TriangleWarning";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";
import CryptoAddressPicker from "components/CryptoAddressPicker";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import colors from "shared/colors";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";

const styles = {
  addressPicker: {
    margin: "0 0 15px 0"
  },
  paddedHorizontal: {
    padding: "0 40px"
  },
  nonEIP55warningIcon: {
    marginLeft: 5,
    cursor: "pointer"
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
  isValid: boolean,
  recipientWarning: ?Error
};
const initialState = {
  isValid: true,
  recipientWarning: null
};
class SendAddress extends PureComponent<Props<*>, State> {
  state = initialState;
  _unmounted = false;
  _nonce = 0;

  componentDidMount() {
    this.validateAddress();
  }
  async componentDidUpdate(prevProps) {
    const { account, transaction, bridge } = this.props;
    const prevRecipient = prevProps.bridge.getTransactionRecipient(
      prevProps.account,
      prevProps.transaction
    );
    const currentRecipient = bridge.getTransactionRecipient(
      account,
      transaction
    );
    if (prevRecipient !== currentRecipient) {
      this.validateAddress();
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
  }

  async validateAddress() {
    const { account, transaction, bridge, restlay } = this.props;
    const currency = getCryptoCurrencyById(account.currency_id);
    const recipient = bridge.getTransactionRecipient(account, transaction);
    const nonce = ++this._nonce;
    if (recipient) {
      const isValid = await bridge.isRecipientValid(
        restlay,
        currency,
        recipient
      );
      const recipientWarning =
        bridge.recipientWarning && isValid
          ? await bridge.recipientWarning(recipient)
          : null;

      if (nonce !== this._nonce || this._unmounted) return;
      this.setState({ isValid, recipientWarning });
    } else {
      if (nonce !== this._nonce || this._unmounted) return;
      this.setState(initialState);
    }
  }

  onChange = async (recipient: string) => {
    const { onChangeTransaction, bridge, transaction, account } = this.props;
    onChangeTransaction(
      bridge.editTransactionRecipient(account, transaction, recipient)
    );
  };

  render() {
    const { account, bridge, transaction, classes } = this.props;
    const { isValid, recipientWarning } = this.state;
    return (
      <Fragment>
        <ModalSubTitle>
          <Trans i18nKey="send:details.address.title" />
          {isValid &&
            recipientWarning && (
              <Tooltip title={recipientWarning.message} placement="top">
                <Warning
                  width={14}
                  height={14}
                  color={colors.warning}
                  className={classes.nonEIP55warningIcon}
                />
              </Tooltip>
            )}
        </ModalSubTitle>
        <div className={classes.paddedHorizontal}>
          <CryptoAddressPicker
            id="address"
            onChange={this.onChange}
            value={bridge.getTransactionRecipient(account, transaction)}
            isValid={isValid}
            fullWidth
            inputProps={{ style: { paddingBottom: 15, color: colors.black } }}
            className={classes.addressPicker}
          />
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(connectData(SendAddress));
