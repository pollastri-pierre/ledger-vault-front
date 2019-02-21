// @flow

import React from "react";
import type { Match } from "react-router-dom";

import SearchOperations from "components/search/SearchOperations";

type Props = {
  match: Match
};

const OperatorTransactions = ({ match }: Props) => (
  <SearchOperations match={match} />
);

export default OperatorTransactions;
