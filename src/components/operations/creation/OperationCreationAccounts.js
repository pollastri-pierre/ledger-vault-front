import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";
import CurrencyAccountValue from "../../CurrencyAccountValue";
import CurrencyUnitValue from "../../CurrencyUnitValue";
import { countervalueForRate } from "../../../data/currency";

import "./OperationCreationAccounts.css";

function OperationCreationAccounts(props) {
  const { accounts, selectedAccount, onSelect } = props;

  return (
    <div className="operation-creation-accounts wrapper">
      <div className="tab-title">Account to debit</div>
      {_.map(accounts, cur => {
        const counterValueUnit = countervalueForRate(
          cur.currencyRate,
          cur.balance
        );

        return (
          <div
            onClick={() => onSelect(cur)}
            role="button"
            tabIndex="0"
            key={cur.id}
            className={`operation-creation-account
            ${cur.currency.name
              .split(" ")
              .join("-")
              .toLowerCase()}
            ${
              selectedAccount && selectedAccount.id === cur.id ? "selected" : ""
            }`}
          >
            <div className="account-top">
              <span className="account-name">{cur.name}</span>
              <span className="account-balance">
                <CurrencyAccountValue
                  account={cur}
                  value={cur.balance}
                />
              </span>
            </div>
            <div className="account-botom">
              <span className="account-currency">{cur.currency.name}</span>
              <span className="account-countervalue">
                <CurrencyUnitValue {...counterValueUnit} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

OperationCreationAccounts.defaultProps = {
  selectedAccount: {}
};

OperationCreationAccounts.propTypes = {
  onSelect: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedAccount: PropTypes.shape({})
};

export default OperationCreationAccounts;
