//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import Card from "../../components/Card";
import ReceiveFundsCard from "./ReceiveFundsCard";
import DataTableOperation from "../../components/DataTableOperation";
import QuicklookGraph from "./QuicklookGraph";
import type { Account, Operation } from "../../datatypes";
import "./Account.css";

class AccountView extends Component<{
  account: Account,
  operations: Array<Operation>
}> {
  render() {
    const { account, operations } = this.props;
    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <Card className="balance" title="Balance">
                <p className="amount">
                  <CurrencyNameValue
                    currencyName={account.currency.name}
                    value={account.balance}
                  />
                </p>
                <span className="date">Today, 3AM{/* TODO */}</span>
              </Card>

              <Card className="countervalue" title="Countervalue">
                <div className="bloc-content">
                  <p className="amount ctv">
                    <CurrencyNameValue
                      currencyName={account.reference_conversion.currency_name}
                      value={account.reference_conversion.balance}
                    />
                  </p>
                  <span className="date">
                    ETH 1 ≈ {account.reference_conversion.currency_name} ???
                    {/* FIXME we need that data too */}
                  </span>
                </div>
              </Card>
            </div>
            <ReceiveFundsCard hash={account.receive_address} />
          </div>
          <Card className="quicklook" title="Quicklook">
            <QuicklookGraph
              data={operations.map((o: Operation) => ({
                time: new Date(o.time),
                amount: o.amount,
                currency: o.currency
              }))}
            />
          </Card>
        </div>
        <Card
          title="last operations"
          titleRight={
            <span>
              VIEW ALL{/* TODO make that a component, use react-router <Link> */}
            </span>
          }
        >
          <DataTableOperation
            operations={operations}
            columnIds={["date", "address", "status", "amount"]}
          />
        </Card>
      </div>
    );
  }
}

export default connectData(AccountView, {
  api: { account: api.account, operations: api.accountOperations },
  propsToApiParams: props => ({ accountId: props.match.params.id })
});
