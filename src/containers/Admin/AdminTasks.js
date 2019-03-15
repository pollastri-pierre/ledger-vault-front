// @flow
import React, { PureComponent } from "react";
import type { Match } from "react-router-dom";
import { withRouter } from "react-router";

import PendingRequests from "containers/PendingRequests/PendingRequests";

type Props = {
  match: Match,
};

class AdminTasks extends PureComponent<Props> {
  render() {
    const { match } = this.props;
    return <PendingRequests match={match} />;
  }
}

export default withRouter(AdminTasks);
