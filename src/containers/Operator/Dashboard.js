// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class OperatorDashboard extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Operator Dashboard
        </Text>
      </Card>
    );
  }
}

export default OperatorDashboard;
