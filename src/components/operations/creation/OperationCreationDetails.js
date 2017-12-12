// @flow

import * as React from "react";
import invariant from "invariant";
import { Component } from "react";
import connectData from "../../../restlay/connectData";
import { PopBubble, TextField, Divider } from "../../../components";
import ArrowDown from "../../icons/ArrowDown";
import CurrencyNameValue from "../../CurrencyNameValue";
import type { Unit, Account } from "../../../data/types";
import type { Details } from "../../NewOperationModal";
import AccountCalculateFeeQuery from "../../../api/queries/AccountCalculateFeeQuery";
import ValidateAddressQuery from "../../../api/queries/ValidateAddressQuery";
import type { Speed } from "../../../api/queries/AccountCalculateFeeQuery";
import {
  countervalueForRate,
  formatCurrencyUnit
} from "../../../data/currency";
import CryptoAddressPicker from "../../CryptoAddressPicker";

import type { Currency } from "../../../data/types";

import "./OperationCreationDetails.css";

type Props = {
  account: Account,
  saveDetails: Function,
  details: Details,

  // from connectData
  restlay: *
};

type State = {
  unit: Unit,
  unitMenuOpen: boolean,
  maxMenuOpen: boolean,
  amount: string,
  amountIsValid: boolean,
  satoshis: number,
  address: string,
  addressIsValid: boolean,
  feesMenuOpen: boolean,
  feesSelected: string,
  feesAmount: number
};

type Fee = {
  title: string
};

class OperationCreationDetails extends Component<Props, State> {
  unitMenuAnchor: ?HTMLDivElement;
  maxMenuAnchor: ?HTMLDivElement;
  feesMenuAnchor: ?HTMLDivElement;
  // feesList
  fees: {
    slow: Fee,
    medium: Fee,
    fast: Fee
  };

  constructor(props: Props) {
    super(props);

    const { account } = this.props;

    this.fees = {
      slow: {
        title: "Slow (1 hour)"
      },
      medium: {
        title: "Medium (30 minutes)"
      },
      fast: {
        title: "Fast (10 minutes)"
      }
    };

    this.state = {
      unit: account.currency.units[0],
      unitMenuOpen: false,
      maxMenuOpen: false,
      amount: "",
      amountIsValid: true,
      satoshis: 0,
      address: "",
      addressIsValid: true,
      feesMenuOpen: false,
      feesSelected: "medium",
      feesAmount: 0
    };

    this.setFees("medium");
  }

  currency: ?Currency;
  unitMenuAnchor: ?HTMLElement;
  maxMenuAnchor: ?HTMLElement;
  feesMenuAnchor: ?HTMLElement;
  // feesList
  fees: {
    slow: Fee,
    medium: Fee,
    fast: Fee
  };

  setAmount = (
    amount: string = this.state.amount,
    magnitude: number = this.state.unit.magnitude,
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

  selectUnit = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const unitNb = parseInt(target.dataset.unit, 10); // FIXME ideally shouldn't need to use a dataset html attribute but have the data passed-in
    const unit = this.props.account.currency.units[unitNb];

    this.setState({
      unit,
      unitMenuOpen: false
    });

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

    const magnitude = this.state.unit.magnitude;
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
            this.setState({ addressIsValid: r.valid }, this.validateTab);
          }
        });
    }
  };

  setFees = (fee: Speed) => {
    const { restlay, account } = this.props;

    restlay
      .fetchQuery(new AccountCalculateFeeQuery({ account, speed: fee }))
      .then(res => {
        const feesAmount = res.value;

        this.setState({ feesAmount });
        this.setAmount(undefined, undefined, feesAmount);
      });
  };

  selectFee = (e: SyntheticEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const feesSelected = target.dataset.fee;
    invariant(
      feesSelected === "fast" ||
        feesSelected === "slow" ||
        feesSelected === "medium",
      "invalid fee %s",
      feesSelected
    );
    this.setFees(feesSelected);

    this.setState({
      feesSelected,
      feesMenuOpen: false
    });
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
      fees: this.state.feesAmount
    };

    this.props.saveDetails(details);
  };

  getCounterValue = (sat: number, showCode: boolean = false) => {
    const counterValue = countervalueForRate(
      this.props.account.currencyRate,
      sat
    );
    const fiat = formatCurrencyUnit(
      counterValue.unit,
      counterValue.value,
      showCode,
      false,
      true
    );

    return fiat;
  };

  render() {
    const { account } = this.props;
    return (
      <div className="operation-creation-details wrapper">
        {/* Amount */}

        <div className="tab-title">Amount</div>
        <div className="amount-field-wrapper" style={{ position: "relative" }}>
          <TextField
            placeholder="0"
            value={this.state.amount}
            inputProps={{
              style: {
                textAlign: "right",
                paddingRight: "20px",
                fontSize: "18px"
              }
            }}
            error={!this.state.amountIsValid}
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
            {this.props.account.currencyRate.fiat}
          </div>
          <div
            style={{
              float: "right"
            }}
          >
            {this.getCounterValue(this.state.satoshis)}
          </div>
        </div>
        <PopBubble
          open={this.state.unitMenuOpen}
          anchorEl={this.unitMenuAnchor}
          onRequestClose={() => this.setState({ unitMenuOpen: false })}
        >
          <ul className="operation-creation-unit-list">
            {account.currency.units.map((unit, index) => (
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
        <CryptoAddressPicker
          id="address"
          onChange={this.updateAddress}
          value={this.state.address}
          isValid={this.state.addressIsValid}
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
              currencyName={account.currency.name}
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
            {this.getCounterValue(this.state.feesAmount, true)}
          </div>
        </div>
        <PopBubble
          open={this.state.feesMenuOpen}
          anchorEl={this.feesMenuAnchor}
          onRequestClose={() => this.setState({ feesMenuOpen: false })}
          className="operation-creation-fees-menu"
        >
          <ul className="operation-creation-fees-list">
            <li>
              <a
                href="fee"
                onClick={this.selectFee}
                data-fee="slow"
                className={this.state.feesSelected === "slow" ? "active" : ""}
              >
                Slow (1 hour)
              </a>
            </li>
            <li>
              <a
                href="fee"
                onClick={this.selectFee}
                data-fee="medium"
                className={this.state.feesSelected === "medium" ? "active" : ""}
              >
                Medium (30 minutes)
              </a>
            </li>
            <li>
              <a
                href="fee"
                onClick={this.selectFee}
                data-fee="fast"
                className={this.state.feesSelected === "fast" ? "active" : ""}
              >
                Fast (10 minutes)
              </a>
            </li>
          </ul>
        </PopBubble>
      </div>
    );
  }
}

export default connectData(OperationCreationDetails);
