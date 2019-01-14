// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import last from "lodash/last";

import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";
import type { Account } from "data/types";
import type { WalletBridge } from "bridge/types";

import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import TextField from "components/utils/TextField";
import InputCurrency from "components/InputCurrency";
import TotalFees from "components/Send/TotalFees";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";

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
  bridge: WalletBridge<Transaction>
};

type GasPriceStatus = "fetching" | "loaded" | "error";

type State = {
  gasPriceStatus: GasPriceStatus,
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
    if (
      prevProps.transaction.gasLimit !== this.props.transaction.gasLimit ||
      prevProps.transaction.gasPrice !== this.props.transaction.gasPrice
    ) {
      this.loadFees();
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
    // TODO this is basically A MOCK, we currently don't have endpoint to fetch it
    // we have an endpoint but no gate implementation to facilitate http call
    await new Promise(r => setTimeout(r, 1e3));
    if (this._unmounted) return;
    this.setState({ gasPriceStatus: "loaded" });
    const { transaction, onChangeTransaction } = this.props;
    if (!transaction.gasPrice) {
      const HARDCODED_GAS_PRICE = 10000000000;
      onChangeTransaction({ ...transaction, gasPrice: HARDCODED_GAS_PRICE });
    }
  }

  state = {
    gasPriceStatus: "fetching",
    totalFees: 0
  };

  createMutation = field => (e: SyntheticEvent<HTMLInputElement>) => {
    const { transaction, onChangeTransaction } = this.props;
    const { value } = e.currentTarget;
    onChangeTransaction({ ...transaction, [field]: parseInt(value) });
  };

  onGasPriceChange = (gasPrice: number) => {
    const { transaction, onChangeTransaction } = this.props;
    onChangeTransaction({ ...transaction, gasPrice });
  };
  onGasLimitChange = this.createMutation("gasLimit");

  render() {
    const { classes, transaction, account } = this.props;
    const currency = getCryptoCurrencyById(account.currency_id);
    const { gasPriceStatus, totalFees } = this.state;
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
              defaultUnit={last(currency.units)}
              value={transaction.gasPrice === null ? 0 : transaction.gasPrice}
              disabled={gasPriceStatus === "fetching"}
            />
          </div>
          <div className={classes.cell}>
            <ModalSubTitle noPadding>
              <Trans i18nKey="send:details.gasLimit" />
            </ModalSubTitle>
            <TextField
              placeholder="0"
              fullWidth
              inputProps={inputProps}
              value={
                transaction.gasLimit ? transaction.gasLimit.toString() : ""
              }
              error={false}
              onChange={this.onGasLimitChange}
            />
          </div>
        </div>
        <TotalFees account={account} totalFees={totalFees} />
      </Fragment>
    );
  }
}

export default withStyles(styles)(FeesFieldEthereumKind);
