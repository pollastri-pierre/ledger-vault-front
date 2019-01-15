// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";
import type { RestlayEnvironment } from "restlay/connectData";

import connectData from "restlay/connectData";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import TextField from "components/utils/TextField";
import InputCurrency from "components/InputCurrency";
import TotalFees from "components/Send/TotalFees";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import { getFees } from "components/Send/helpers";

const styles = {
  root: {
    // padding because integrated inside modal
    // TODO: use global container
    padding: "0 40px",

    // margin top because the way things are make it easier to put
    // margin here instead of in the parent. this is semantically wrong
    // but let's start with that..
    marginTop: 20,

    display: "flex",

    // space all children by 20px
    "&> * + *": {
      marginLeft: 20
    }
  },
  cell: {
    flex: 1
  }
};

const inputProps = { style: { textAlign: "right", color: "black" } };

type Props<Transaction> = {
  classes: { [_: $Keys<typeof styles>]: string },
  transaction: Transaction,
  account: Account,
  onChangeTransaction: Transaction => void,
  bridge: WalletBridge<Transaction>,
  restlay: RestlayEnvironment
};

type GasPriceStatus = "fetching" | "loaded" | "error";
type GasLimitStatus = "fetching" | "loaded" | "error";

type State = {
  gasPriceStatus: GasPriceStatus,
  gasLimitStatus: GasLimitStatus,
  totalFees: number
};

class FeesFieldEthereumKind extends PureComponent<
  Props<EthereumTransaction>,
  State
> {
  componentDidMount() {
    this.loadGasPrice();
    this.loadFees();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  async componentDidUpdate(prevProps) {
    const { transaction } = this.props;

    if (
      prevProps.transaction.gasLimit !== transaction.gasLimit ||
      prevProps.transaction.gasPrice !== transaction.gasPrice
    ) {
      this.loadFees();
    }
    if (prevProps.transaction.recipient !== transaction.recipient) {
      this.loadGasPrice();
    }
  }

  _unmounted = false;

  async loadFees() {
    const { account, transaction, bridge } = this.props;
    const totalFees = await bridge.getFees(account, transaction);
    if (this._unmounted) return;
    this.setState({ totalFees });
  }

  async loadGasPrice() {
    const { account, transaction, bridge, restlay } = this.props;
    const currency = getCryptoCurrencyById(account.currency_id);

    const isRecipientValid = await bridge.isRecipientValid(
      restlay,
      currency,
      transaction.recipient
    );
    if (this._unmounted) return;
    if (isRecipientValid) {
      // NOTE: both initialized with null because gate expects it for ETH
      const operation = {
        amount: transaction.amount || 0,
        recipient: transaction.recipient,
        gas_limit: null,
        gas_price: null
      };
      const estimatedFees = await getFees(
        account,
        transaction,
        operation,
        restlay
      );

      if (this._unmounted) return;
      this.setState({ gasPriceStatus: "loaded", gasLimitStatus: "loaded" });
      const { onChangeTransaction } = this.props;
      onChangeTransaction({
        ...transaction,
        gasPrice: estimatedFees.gas_price,
        gasLimit: estimatedFees.gas_limit
      });
    } else {
      return;
    }
  }

  state = {
    gasPriceStatus: "fetching",
    gasLimitStatus: "fetching",
    totalFees: 0
  };

  createMutation = field => (e: SyntheticEvent<HTMLInputElement>) => {
    const { transaction, onChangeTransaction } = this.props;
    const { value } = e.currentTarget;
    onChangeTransaction({ ...transaction, [field]: parseInt(value, 10) });
  };

  onGasPriceChange = (gasPrice: number) => {
    const { transaction, onChangeTransaction } = this.props;
    onChangeTransaction({ ...transaction, gasPrice });
  };

  onGasLimitChange = this.createMutation("gasLimit");

  render() {
    const { classes, transaction, account } = this.props;
    const currency = getCryptoCurrencyById(account.currency_id);
    const { gasPriceStatus, gasLimitStatus, totalFees } = this.state;
    return (
      <Fragment>
        <div className={classes.root}>
          <div className={classes.cell}>
            <ModalSubTitle noPadding>
              <Trans i18nKey="send:details.gasPrice" />
            </ModalSubTitle>
            <InputCurrency
              currency={currency}
              placeholder={gasPriceStatus === "fetching" ? "Loading..." : "0"}
              onChange={this.onGasPriceChange}
              defaultUnit={currency.units[1]}
              value={transaction.gasPrice === null ? 0 : transaction.gasPrice}
              disabled={gasPriceStatus === "fetching"}
            />
          </div>
          <div className={classes.cell}>
            <ModalSubTitle noPadding>
              <Trans i18nKey="send:details.gasLimit" />
            </ModalSubTitle>
            <TextField
              placeholder={gasLimitStatus === "fetching" ? "Loading..." : "0"}
              fullWidth
              inputProps={inputProps}
              value={
                transaction.gasLimit ? transaction.gasLimit.toString() : ""
              }
              error={false}
              disabled={gasLimitStatus === "fetching"}
              onChange={this.onGasLimitChange}
            />
          </div>
        </div>
        <TotalFees account={account} totalFees={totalFees} />
      </Fragment>
    );
  }
}

export default withStyles(styles)(connectData(FeesFieldEthereumKind));
