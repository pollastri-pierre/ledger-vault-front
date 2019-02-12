// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class OperatorPendingTx extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Operator Pending Transactions
        </Text>
      </Card>
    );
  }
}

export default OperatorPendingTx;
