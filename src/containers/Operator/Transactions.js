// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";

import Text from "components/base/Text";
import Card, { CardLoading, CardError } from "components/base/Card";

type Props = {};

class OperatorTransactions extends PureComponent<Props> {
  render() {
    return (
      <Card>
        <Text header>transactions</Text>
      </Card>
    );
  }
}

export default connectData(OperatorTransactions, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {}
});
