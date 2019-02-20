// @flow

import React, { PureComponent } from "react";

import type { Match } from "react-router-dom";

import Search from "containers/Search";

type Props = {
  match: Match
};

class AdminTransactions extends PureComponent<Props> {
  render() {
    const { match } = this.props;
    return <Search match={match} />;
  }
}

export default AdminTransactions;
