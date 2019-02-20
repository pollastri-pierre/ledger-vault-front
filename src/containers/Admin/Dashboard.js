// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";

import Text from "components/base/Text";
import Card, { CardLoading, CardError } from "components/base/Card";

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

export default connectData(AdminDashboard, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {}
});
