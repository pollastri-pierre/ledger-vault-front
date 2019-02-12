// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class AdminRule extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Admin Rule
        </Text>
      </Card>
    );
  }
}

export default AdminRule;
