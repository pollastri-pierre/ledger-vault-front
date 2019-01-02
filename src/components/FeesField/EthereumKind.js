// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import type { Transaction as EthereumTransaction } from "bridge/EthereumBridge";
import type { Account } from "data/types";

import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import TextField from "components/utils/TextField";

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
  onChangeTransaction: Transaction => void
};

type GasPriceStatus = "fetching" | "loaded" | "error";

type State = {
  gasPriceStatus: GasPriceStatus
};

class FeesFieldEthereumKind extends PureComponent<
  Props<EthereumTransaction>,
  State
> {
  componentDidMount() {
    this.loadGasPrice();
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  _unmounted = false;

  async loadGasPrice() {
    // TODO this is basically A MOCK, we currently don't have endpoint to fetch it
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
    gasPriceStatus: "fetching"
  };

  createMutation = field => (e: SyntheticEvent<HTMLInputElement>) => {
    const { transaction, onChangeTransaction } = this.props;
    const { value } = e.currentTarget;
    onChangeTransaction({ ...transaction, [field]: parseInt(value) });
  };

  onGasPriceChange = this.createMutation("gasPrice");
  onGasLimitChange = this.createMutation("gasLimit");

  render() {
    const { classes, transaction } = this.props;
    const { gasPriceStatus } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.cell}>
          <ModalSubTitle noPadding>
            <Trans i18nKey="send:details.gasPrice" />
          </ModalSubTitle>
          <TextField
            disabled={gasPriceStatus === "fetching"}
            placeholder={gasPriceStatus === "fetching" ? "Loading..." : "0"}
            fullWidth
            inputProps={inputProps}
            value={transaction.gasPrice ? transaction.gasPrice.toString() : ""}
            error={false}
            onChange={this.onGasPriceChange}
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
            value={transaction.gasLimit ? transaction.gasLimit.toString() : ""}
            error={false}
            onChange={this.onGasLimitChange}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(FeesFieldEthereumKind);
