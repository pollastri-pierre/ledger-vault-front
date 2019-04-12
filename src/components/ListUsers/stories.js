/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import ListUsers from "components/ListUsers";
import { genUsers } from "data/mock-entities";

const users = genUsers(20);
const members = users.slice(0, 5);

const removed = members.map(m => ({
  user: m,
  history: "removed",
}));
const added = users.slice(7, 9).map(m => ({
  user: m,
  history: "added",
}));

const unchanged = users.slice(10, 12).map(m => ({
  user: m,
  history: "unchanged",
}));

storiesOf("other", module).add("ListUsers", () => (
  <div style={{ width: 400 }}>
    <ListUsers usersWithHistory={[...removed, ...added, ...unchanged]} />
  </div>
));
