// @flow
import React, { Component } from "react";
import ModalRoute from "../../components/ModalRoute";
import OperationModal from "../../components/operations/OperationModal";
import connectData from "../../restlay/connectData";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import CurrencyCounterValueConversion from "../../components/CurrencyCounterValueConversion";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import ReceiveFundsCard from "./ReceiveFundsCard";
import DataTableOperation from "../../components/DataTableOperation";
import AccountOperationsQuery from "../../api/queries/AccountOperationsQuery";
import AccountQuery from "../../api/queries/AccountQuery";
import CurrenciesQuery from "../../api/queries/CurrenciesQuery";
import DateFormat from "../../components/DateFormat";
import type { Account, Operation, Currency } from "../../data/types";
import "./Account.css";
import QuicklookCard from "./QuicklookCard";
class AccountView extends Component<
  {
    account: Account,
    operations: Array<Operation>,
    currencies: Array<Currency>,
    reloading: boolean,
    match: {
      url: string,
      params: {
        id: string
      }
    }
  },
  *
> {
  constructor(props) {
    super(props);
    this.state = {
      quicklookFilter: "balance",
      tabsIndex: 0
    };
  }

  render() {
    const { account, operations, reloading } = this.props;

    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <Card reloading={reloading} className="balance" title="Balance">
                <CardField label={<DateFormat date={new Date()} />}>
                  <CurrencyAccountValue
                    account={account}
                    value={account.balance}
                  />
                </CardField>
              </Card>

              <Card
                reloading={reloading}
                className="countervalue"
                title="Countervalue"
              >
                <CardField
                  label={<CurrencyCounterValueConversion account={account} />}
                >
                  <CurrencyAccountValue
                    account={account}
                    value={account.balance}
                    countervalue
                  />
                </CardField>
              </Card>
            </div>
            <ReceiveFundsCard hash={account.receive_address} />
          </div>

          <QuicklookCard />
        </div>
        <Card reloading={reloading} title="last operations">
          <DataTableOperation
            accounts={[account]}
            operations={operations}
            columnIds={["date", "address", "status", "countervalue", "amount"]}
          />
        </Card>
        <ModalRoute
          path={`${this.props.match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </div>
    );
  }
}

// FIXME have a generic component for screen errors
const RenderError = ({ error }: { error: Error }) => (
  <span style={{ color: "#fff" }}>
    {(error && error.message) || error.toString()}
  </span>
);

export default connectData(AccountView, {
  queries: {
    currencies: CurrenciesQuery,
    account: AccountQuery,
    operations: AccountOperationsQuery
  },
  propsToQueryParams: props => ({ accountId: props.match.params.id }),
  RenderError
});
