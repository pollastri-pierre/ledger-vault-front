/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import ListGroupMembers from "components/ListGroupMembers";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { genUsers } from "data/mock-entities";

const users = genUsers(20);
const members = users.slice(0, 5);
storiesOf("components", module).add("ListGroupMembers", () => (
  <div style={{ width: 400 }}>
    <Box flow={50}>
      <Box flow={10}>
        <Text fontWeight="bold">Regular list of member</Text>
        <ListGroupMembers allUsers={users} users={members} />
      </Box>
      <Box flow={10}>
        <Text fontWeight="bold">List with diff</Text>
        <ListGroupMembers
          allUsers={users}
          users={members}
          editUsers={[users[0].id, users[19].id]}
        />
      </Box>
    </Box>
  </div>
));
