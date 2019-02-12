// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class AdminOperators extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Admin Operators
        </Text>
      </Card>
    );
  }
}

export default AdminOperators;
