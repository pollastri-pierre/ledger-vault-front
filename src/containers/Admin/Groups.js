// @flow
import React, { PureComponent } from "react";
import Text from "components/base/Text";
import Card from "components/base/Card";

class AdminGroups extends PureComponent<*> {
  render() {
    return (
      <Card>
        <Text uppercase large>
          Admin Groups
        </Text>
      </Card>
    );
  }
}

export default AdminGroups;
