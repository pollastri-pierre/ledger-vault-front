// @flow

import * as React from "react";
import { Component } from "react";
import bitcoinAddress from "bitcoin-address";
import currencies from "../../../currencies";
import { PopBubble, TextField, Divider } from "../../../components";
import ArrowDown from "../../icons/ArrowDown";
import type { Currency, Unit } from "../../../datatypes";
import CurrencyNameValue from "../../CurrencyNameValue";

import "./OperationCreationDetails.css";

type Props = {
  account: {
    currency: Currency,
    balance: number
  }
};

type State = {
  unit: Unit,
  unitMenuOpen: boolean,
  maxMenuOpen: boolean,
  amount: string,
  amountIsValid: boolean,
  address: string,
  addressIsValid: boolean,
  feesMenuOpen: boolean,
  feesSelected: string,
  feesAmount: number
};

type Fee = {
  amount: number,
  title: string
};

class OperationCreationDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { account } = this.props;
    this.currency = currencies.find(c => c.name === account.currency.name);

    // TODO Get fees from the gate
    this.fees = {
      low: {
        amount: 15000,
        title: "Slow (1 hour)"
      },
      medium: {
        amount: 30000,
        title: "Medium (30 minutes)"
      },
      high: {
        amount: 45000,
        title: "Fast (10 minutes)"
      }
    };

    this.state = {
      // $FlowFixMe
      unit: this.currency.units[0],
      unitMenuOpen: false,
      maxMenuOpen: false,
      amount: "",
      amountIsValid: true,
      address: "",
      addressIsValid: true,
      feesMenuOpen: false,
      feesSelected: "medium",
      feesAmount: this.fees.medium.amount
    };
  }

  currency: ?Currency;
  unitMenuAnchor: ?HTMLDivElement;
  maxMenuAnchor: ?HTMLDivElement;
  feesMenuAnchor: ?HTMLDivElement;
  // feesList
  fees: {
    low: Fee,
    medium: Fee,
    high: Fee
  };

  setAmount = (
    amount: string = this.state.amount,
    magnitude: number = this.state.unit.magnitude,
    fees: number = this.state.feesAmount
  ) => {
    const value = parseFloat(amount) || 0;
    const balance = this.props.account.balance;
    const max = (balance - fees) / 10 ** magnitude;
    const decimals = amount.replace(/(.*\.|.*[^.])/, "").replace(/0+$/, "");

    this.setState({
      amount,
      amountIsValid: value <= max && decimals.length <= magnitude
    });
  };

  selectUnit = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target: HTMLDivElement = e.currentTarget;
    const unitNb: number = parseInt(target.dataset.unit);
    // $FlowFixMe
    const unit: Unit = this.currency.units[unitNb];

    this.setState({
      unit,
      unitMenuOpen: false
    });

    this.setAmount(this.state.amount, unit.magnitude);
  };

  updateAmount = (e: SyntheticEvent<HTMLInputElement>) => {
    const value: string = e.currentTarget.value;
    const regex: regex = /^(\d*\.?\d*)?$/;

    if (regex.test(value)) {
      this.setAmount(value);
    }
  };

  setMax = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();

    const magnitude = this.state.unit.magnitude;
    const balance = this.props.account.balance;
    const fees = this.state.feesAmount;
    const amount = (balance - fees) / 10 ** magnitude;

    this.setState({ maxMenuOpen: false });

    this.setAmount(`${amount}`);
  };

  updateAddress = (e: SyntheticEvent<HTMLInputElement>) => {
    const address: string = e.currentTarget.value.trim();
    const addressIsValid: boolean =
      address === "" || bitcoinAddress.validate(address);

    this.setState({
      address,
      addressIsValid
    });
  };

  selectFee = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target: HTMLDivElement = e.currentTarget;
    const feesSelected: string = target.dataset.fee;
    const feesAmount: number = this.fees[feesSelected].amount;

    this.setState({
      feesSelected,
      feesAmount,
      feesMenuOpen: false
    });

    this.setAmount(undefined, undefined, feesAmount);
  };

  feesList = () => {
    let list = [];

    for (const key in this.fees) {
      const fee: Fee = this.fees[key];

      list.push(
        <li key={key}>
          <a
            href="fee"
            onClick={this.selectFee}
            data-fee={key}
            className={key === this.state.feesSelected ? "active" : ""}
          >
            {fee.title}
          </a>
        </li>
      );
    }

    return list;
  };

  render() {
    return (
      <div className="operation-creation-details wrapper">
        {/* Amount */}

        <div className="tab-title">Amount</div>
        <div className="amount-field-wrapper" style={{ position: "relative" }}>
          <TextField
            className="operation-creation-amount-field"
            id="operation-creation-amount-field"
            hintText="0"
            value={this.state.amount}
            hasError={!this.state.amountIsValid}
            onChange={this.updateAmount}
            style={{ textAlign: "right" }}
          />
          <div
            className="operation-creation-unit-selector"
            ref={e => {
              this.unitMenuAnchor = e;
            }}
            onClick={() => this.setState({ unitMenuOpen: true })}
            role="button"
            // tabIndex={0}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 0
            }}
          >
            <div className="operation-creation-unit" style={{ float: "left" }}>
              {this.state.unit.code}
            </div>
            <div
              className="operation-creation-arrow-down"
              style={{ float: "left", marginLeft: "9.5px" }}
            >
              <ArrowDown />
            </div>
          </div>
          <div
            className="operation-creation-arrow-down"
            style={{
              cursor: "pointer",
              position: "absolute",
              right: 0,
              top: 0
            }}
            ref={e => {
              this.maxMenuAnchor = e;
            }}
            onClick={() => this.setState({ maxMenuOpen: true })}
          >
            <ArrowDown />
          </div>
        </div>
        <div className="operation-creation-countervalue">
          <div
            style={{
              float: "left"
            }}
          >
            EUR
          </div>
          <div
            style={{
              float: "right"
            }}
          >
            1,024.42
          </div>
        </div>
        <PopBubble
          open={this.state.unitMenuOpen}
          anchorEl={this.unitMenuAnchor}
          onRequestClose={() => this.setState({ unitMenuOpen: false })}
        >
          <ul className="operation-creation-unit-list">
            {// $FlowFixMe
            this.currency.units.map((unit, index) => (
              <li key={unit.name}>
                <a
                  href="unit"
                  onClick={this.selectUnit}
                  data-unit={index}
                  className={unit.name === this.state.unit.name ? "active" : ""}
                >
                  {unit.code}
                </a>
              </li>
            ))}
          </ul>
        </PopBubble>
        <PopBubble
          open={this.state.maxMenuOpen}
          anchorEl={this.maxMenuAnchor}
          onRequestClose={() => this.setState({ maxMenuOpen: false })}
          className="operation-creation-send-max"
        >
          <a href="setMax" onClick={this.setMax}>
            Send max
          </a>
        </PopBubble>

        {/* Address */}

        <div className="tab-title title-address">Address to credit</div>
        <TextField
          className="operation-creation-address"
          id="operation-creation-address"
          style={{ fontSize: "13px" }}
          onChange={this.updateAddress}
          hasError={!this.state.addressIsValid}
          value={this.state.address}
        />

        {/* Fees */}

        <div className="tab-title">Confirmation fees</div>
        <div
          className="operation-creation-fees-wrapper"
          style={{ position: "relative" }}
        >
          <div
            className="operation-creation-fees-button"
            ref={e => {
              this.feesMenuAnchor = e;
            }}
            onClick={() => this.setState({ feesMenuOpen: true })}
            style={{
              float: "left"
            }}
          >
            {this.fees[this.state.feesSelected].title}
            <div className="operation-creation-arrow-down">
              <ArrowDown />
            </div>
          </div>
          <div
            className="operation-creation-fees-amount"
            style={{
              float: "right",
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            <CurrencyNameValue
              // $FlowFixMe
              currencyName={this.currency.name}
              value={this.state.feesAmount}
            />
          </div>
        </div>
        <Divider className="operation-creation-fees-divider" />
        <div className="operation-creation-fees-countervalue">
          <div
            style={{
              float: "right",
              fontSize: "11px",
              fontWeight: 600
            }}
          >
            EUR 0.25
          </div>
        </div>
        <PopBubble
          open={this.state.feesMenuOpen}
          anchorEl={this.feesMenuAnchor}
          onRequestClose={() => this.setState({ feesMenuOpen: false })}
          className="operation-creation-fees-menu"
        >
          <ul className="operation-creation-fees-list">{this.feesList()}</ul>
        </PopBubble>
      </div>
    );
  }
}

export default OperationCreationDetails;
