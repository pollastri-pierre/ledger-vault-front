/* eslint-disable react/prop-types */

import React, { Fragment } from "react";
import { storiesOf } from "@storybook/react";
import { genMembers } from "data/mock-entities";
import MemberName from "components/base/MemberName";

const members = genMembers(2);
storiesOf("other", module).add("MemberName", () => (
  <Fragment>{members.map(m => <MemberName key={m.id} member={m} />)}</Fragment>
));
