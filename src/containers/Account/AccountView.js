//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import Card from "../../components/Card";
import DateFormat from "../../components/DateFormat";
import CardField from "../../components/CardField";
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
                <CardField label={<DateFormat date={new Date()} />}>
                  <CurrencyNameValue
                    currencyName={account.currency.name}
                    value={account.balance}
                  />
                </CardField>
              </Card>

              <Card className="countervalue" title="Countervalue">
                <CardField
                  label={`ETH 1 ≈ ${account.reference_conversion
                    .currency_name} ???`}
                >
                  <CurrencyNameValue
                    currencyName={account.reference_conversion.currency_name}
                    value={account.reference_conversion.balance}
                  />
                </CardField>
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
            columnIds={["date", "address", "status", "countervalue", "amount"]}
          />
        </Card>
      </div>
    );
  }
}

export default connectData(AccountView, {
  api: { account: api.account, operations: api.accountOperations },
  propsToApiParams: props => ({ accountId: props.match.params.id }),
  RenderError: ({ error }) => (
    // FIXME have a generic component for screen errors
    <span style={{ color: "#fff" }}>
      {(error && error.message) || "" + error}
    </span>
  )
});
