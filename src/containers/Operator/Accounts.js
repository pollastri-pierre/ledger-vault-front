// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class OperatorAccounts extends PureComponent<*> {
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

export default OperatorAccounts;
