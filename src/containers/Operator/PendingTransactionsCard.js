// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import PendingTransactionsQuery from "api/queries/PendingTransactionsQuery";

import Text from "components/base/Text";
import Card, { CardLoading, CardError } from "components/base/Card";

import type { Transaction } from "data/types";

type Props = {
  operationsPending: Transaction[],
};

class OperatorTransactions extends PureComponent<Props> {
  render() {
    const { operationsPending } = this.props;

    return (
      <Card>
        <Text header i18nKey="operator:pendingTransactions" />
        {!operationsPending.length && (
          <Text i18nKey="operator:pendingTransactionsEmpty" />
        )}
      </Card>
    );
  }
}

export default connectData(OperatorTransactions, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    operationsPending: PendingTransactionsQuery,
  },
});
