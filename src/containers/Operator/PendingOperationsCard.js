// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";

import Text from "components/base/Text";
import Card, { CardLoading, CardError } from "components/base/Card";

import type { Operation } from "data/types";

type Props = {
  operationsPending: Operation[],
};

class OperatorTransactions extends PureComponent<Props> {
  render() {
    const { operationsPending } = this.props;

    return (
      <Card>
        <Text header i18nKey="operator:pendingOperations" />
        {!operationsPending.length && (
          <Text i18nKey="operator:pendingOperationsEmpty" />
        )}
      </Card>
    );
  }
}

export default connectData(OperatorTransactions, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    operationsPending: PendingOperationsQuery,
  },
});
