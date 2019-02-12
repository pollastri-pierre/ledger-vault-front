// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Search from "containers/Search";

import type { Match } from "react-router-dom";

type Props = {
  match: Match
};

class AdminTransactions extends PureComponent<Props> {
  render() {
    const { match } = this.props;
    return (
      <Box>
        <Search match={match} />
      </Box>
    );
  }
}

export default AdminTransactions;
