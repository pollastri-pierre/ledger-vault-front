/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { genUsers } from "data/mock-entities";
import MemberName from "components/base/MemberName";

const users = genUsers(2);
storiesOf("components", module).add("MemberName", () => (
  <>
    {users.map((u) => (
      <MemberName key={u.id} member={u} />
    ))}
  </>
));
