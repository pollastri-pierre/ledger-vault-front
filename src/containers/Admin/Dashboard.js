// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class AdminDashboard extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Admin Dashboard
        </Text>
      </Card>
    );
  }
}

export default AdminDashboard;
