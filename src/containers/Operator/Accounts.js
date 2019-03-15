// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";

import Text from "components/base/Text";
import Card, { CardLoading, CardError } from "components/base/Card";

type Props = {};

class OperatorAccounts extends PureComponent<Props> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Operator Accounts
        </Text>
      </Card>
    );
  }
}

export default connectData(OperatorAccounts, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {},
});
