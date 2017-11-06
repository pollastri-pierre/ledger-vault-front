//@flow
import React from "react";
import connectData from "../../../decorators/connectData";
import api from "../../../data/api-spec";
import type { Currency } from "../../../datatypes";

function AccountCreationCurrencies(props: {
  currencies: Array<Currency>,
  currency: Currency, // FIXME this should just be the currency.name for a better normalization
  onSelect: (cur: Currency) => void // SAME
}) {
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

export default connectData(AccountCreationCurrencies, {
  api: {
    currencies: api.currencies
  }
});
