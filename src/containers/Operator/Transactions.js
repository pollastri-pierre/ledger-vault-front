// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class OperatorTransactions extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Operator Transactions
        </Text>
      </Card>
    );
  }
}

export default OperatorTransactions;
