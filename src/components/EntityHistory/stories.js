/* eslint-disable react/prop-types */

import React, { useState, useMemo } from "react";
import { storiesOf } from "@storybook/react";

import EntityHistory from "components/EntityHistory";
import Box from "components/base/Box";

import { deserializeHistory } from "utils/history";
import groupHistory from "utils/history/fixtures/groupHistory.json";
import userHistory from "utils/history/fixtures/userHistory.json";
import transactionHistory from "utils/history/fixtures/transactionHistory.json";

const historyByType = {
  group: groupHistory,
  user: userHistory,
  transaction: transactionHistory,
};

function Wrapper() {
  const [type, setType] = useState("group");
  const gateHistory = historyByType[type];
  const history = useMemo(() => deserializeHistory(gateHistory), [gateHistory]);
  return (
    <Box flow={20}>
      <Box horizontal flow={10}>
        <button onClick={() => setType("group")}>group</button>
        <button onClick={() => setType("user")}>user</button>
        <button onClick={() => setType("transaction")}>transaction</button>
      </Box>
      <EntityHistory history={history} entityType={type} />
    </Box>
  );
}

storiesOf("components", module).add("EntityHistory", () => <Wrapper />);
