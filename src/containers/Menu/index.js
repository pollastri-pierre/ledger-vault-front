// @flow
import React from "react";
import type { Match, Location } from "react-router-dom";

import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import type { Account, Operation } from "data/types";
import connectData from "restlay/connectData";
import SpinnerCard from "components/spinners/SpinnerCard";
import Box from "components/base/Box";

import AdminMenu from "./AdminMenu";
import OperatorMenu from "./OperatorMenu";

const styles = {
  root: {
    width: 280,
    padding: "25px 35px 0 0"
  }
};
function Menu(props: {
  location: Location,
  match: Match,
  accounts: Array<Account>,
  allPendingOperations: Array<Operation>
}) {
  const { location, accounts, allPendingOperations, match } = props;
  // NOTE: later we can filter by role and it will point to separate file
  return (
    <Box style={styles.root}>
      <AdminMenu match={match} />
      <OperatorMenu
        match={match}
        location={location}
        accounts={accounts}
        allPendingOperations={allPendingOperations}
      />
    </Box>
  );
}

const RenderLoading = () => (
  <Box pt={100} style={styles.root}>
    <SpinnerCard />
  </Box>
);

export default connectData(Menu, {
  RenderLoading,
  queries: {
    allPendingOperations: PendingOperationsQuery
  }
});
