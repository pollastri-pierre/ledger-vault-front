//@flow
import React, { Component } from "react";
import connectData from "../../../restlay/connectData";
import ModalLoading from "../../../components/ModalLoading";
import CurrenciesQuery from "../../../api/queries/CurrenciesQuery";
import type { Currency } from "../../../data/types";

class AccountCreationCurrencies extends Component<{
  currencies: Array<Currency>,
  currency: Currency, // FIXME this should just be the currency.name for a better normalization
  onSelect: (cur: Currency) => void // SAME
}> {
  render() {
    const { props } = this;
    const { currencies, currency, onSelect } = props;
    return (
      <div className="account-creation-currencies wrapper">
        {currencies.map(cur => (
          <div
            onClick={() => onSelect(cur)}
            role="button"
            tabIndex="0"
            key={cur.units[0].name}
            className={`account-creation-currency
            ${cur.units[0].name
              .split(" ")
              .join("-")
              .toLowerCase()}
            ${currency && currency.units[0].name === cur.units[0].name
              ? "selected"
              : ""}`}
          >
            <span className="currency-name">{cur.units[0].name}</span>
            <span className="currency-short">{cur.units[0].symbol}</span>
          </div>
        ))}
      </div>
    );
  }
}

export default connectData(AccountCreationCurrencies, {
  queries: {
    currencies: CurrenciesQuery
  },
  RenderLoading: ModalLoading
});
