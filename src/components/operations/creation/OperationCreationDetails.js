// @flow
import React, { Component } from "react";
import CounterValue from "components/CounterValue";
import { withStyles } from "@material-ui/core/styles";
import colors from "../../../shared/colors";
import connectData from "restlay/connectData";
import { TextField } from "components";
import CurrencyAccountValue from "../../CurrencyAccountValue";
import type { Account } from "data/types";
import type { Details } from "../../NewOperationModal";
import ValidateAddressQuery from "api/queries/ValidateAddressQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import ModalSubTitle from "./ModalSubTitle";
import CryptoAddressPicker from "../../CryptoAddressPicker";
import FeeSelect from "./FeeSelect";
import UnitSelect from "./UnitSelect";

type State = {
  unitIndex: number,
  maxMenuOpen: boolean,
  amount: string,
  amountIsValid: boolean,
  satoshis: number,
  address: string,
  addressIsValid: boolean,
  feesSelected: Speed,
  feesAmount: number
};

const styles = {
  root: {
    padding: "0 40px"
  },
  unitSelect: {
    fontSize: 22
  },
  countervalue: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    lineHeight: 2.42,
    fontSize: 22,
    color: colors.lead,
    marginBottom: 25
  },
  feesFiat: {
    marginTop: 18,
    textAlign: "right",
    color: colors.steel,
    fontWeight: 600,
    fontSize: 11
  }
};

const InputFieldMerge = ({ children }: *) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      width: "100%"
    }}
  >
    {children}
  </div>
);

class OperationCreationDetails extends Component<
  {
    account: Account,
    saveDetails: Function,
    details: Details,
    estimatedFees: number,
    classes: { [_: $Keys<typeof styles>]: string },
    // from connectData
    restlay: *
  },
  State
> {
  constructor(props) {
    super(props);
    this.state = {
      unitIndex: props.details.unitIndex || 0,
      maxMenuOpen: false,
      amount: props.details.amountFormated ? props.details.amountFormated : "",
      amountIsValid: true,
      satoshis: 0,
      address: props.details.address ? props.details.address : "",
      addressIsValid: true,
      feesSelected: "normal",
      feesAmount: 0
    };
    // this.setFees();
  }

  setAmount = (
    amount: string = this.state.amount,
    magnitude: number = this.props.account.currency.units[this.state.unitIndex]
      .magnitude,
    fees: number = this.state.feesAmount
  ) => {
    const satoshis: number = Math.round(
      (parseFloat(amount) || 0) * 10 ** magnitude
    );
    const balance: number = this.props.account.balance;
    const max: number = balance - fees;
    const decimals: string = amount
      .replace(/(.*\.|.*[^.])/, "")
      .replace(/0+$/, "");

    this.setState(
      {
        amount,
        amountIsValid: satoshis <= max && decimals.length <= magnitude,
        satoshis: satoshis
      },
      this.validateTab
    );
  };

  onChangeUnit = (unitIndex: number) => {
    this.setState({ unitIndex });
    const unit = this.props.account.currency.units[unitIndex];
    this.setAmount(this.state.amount, unit.magnitude);
  };

  updateAmount = (e: SyntheticEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    const regex = /^(\d*\.?\d*)?$/;
    if (regex.test(value)) {
      this.setAmount(value);
    }
  };

  setMax = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();

    const magnitude = this.props.account.currency.units[this.state.unitIndex]
      .magnitude;
    const balance = this.props.account.balance;
    const fees = this.state.feesAmount;
    const amount = (balance - fees) / 10 ** magnitude;

    this.setState({ maxMenuOpen: false });

    this.setAmount(`${amount}`);
  };

  updateAddress = (address: string) => {
    const { restlay, account: { currency } } = this.props;
    this.setState({ address, addressIsValid: false }, this.validateTab); // FIXME we might want a "pending" internal state for the component to render not a red validation but another thing
    // NB ideally we will want the CONTINUE button to wait the validation passed.
    // it means we probably need to do the validation from parent and pass-in the validation state
    if (address) {
      restlay // TODO potentially should debounce this check.
        .fetchQuery(new ValidateAddressQuery({ currency, address }))
        .then(r => {
          if (address === this.state.address) {
            // still on same address
            this.setState({ addressIsValid: r.is_valid }, this.validateTab);
            // this.setFees();
          }
        });
    }
  };

  onChangeFee = (feesSelected: Speed) => {
    // this.setFees();
    this.setState({ feesSelected }, this.validateTab);
  };

  validateTab = () => {
    // FIXME this should be refactored and remove. validation to be done in render() / address/amount to come via props from parent
    const details: Details = {
      amount:
        this.state.satoshis > 0 && this.state.amountIsValid
          ? this.state.satoshis
          : null,
      address:
        this.state.address !== "" && this.state.addressIsValid
          ? this.state.address
          : null,
      fees: this.state.feesAmount,
      feesSelected: this.state.feesSelected,
      unitIndex: this.state.unitIndex,
      amountFormated: this.state.amount
    };

    this.props.saveDetails(details);
  };

  render() {
    const { account, classes } = this.props;
    const { unitIndex } = this.state;
    return (
      <div className={classes.root}>
        <ModalSubTitle noPadding>Amount</ModalSubTitle>

        <InputFieldMerge>
          <UnitSelect
            units={account.currency.units}
            index={unitIndex}
            onChange={this.onChangeUnit}
          />
          <TextField
            placeholder="0"
            fullWidth
            data-test="operation-creation-amount"
            inputProps={{
              style: { textAlign: "right", fontSize: 22, color: "black" }
            }}
            value={this.state.amount}
            error={!this.state.amountIsValid}
            onChange={this.updateAmount}
          />
        </InputFieldMerge>

        <div className={classes.countervalue}>
          <div>USD</div>
          <div>
            <CounterValue
              value={this.state.satoshis}
              from={account.currency.name}
            />
          </div>
        </div>

        <ModalSubTitle noPadding>Address to credit</ModalSubTitle>

        <CryptoAddressPicker
          id="address"
          onChange={this.updateAddress}
          value={this.state.address}
          isValid={this.state.addressIsValid}
          fullWidth
          inputProps={{ style: { paddingBottom: 15, color: "black" } }}
          style={{ marginBottom: 15 }}
        />

        <ModalSubTitle noPadding>Confirmation fees</ModalSubTitle>
        <InputFieldMerge>
          <FeeSelect
            value={this.state.feesSelected}
            onChange={this.onChangeFee}
          />
          <div
            style={{
              flex: 1,
              textAlign: "right",
              paddingBottom: 15,
              borderBottom: "1px solid #eeeeee"
            }}
          >
            <CurrencyAccountValue
              account={account}
              value={this.props.estimatedFees}
            />
          </div>
        </InputFieldMerge>

        <div className={classes.feesFiat}>
          <CounterValue
            value={this.props.estimatedFees}
            from={account.currency.name}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connectData(OperationCreationDetails));
