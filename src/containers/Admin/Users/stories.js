/* eslint-disable react/prop-types */

import React from "react";
import StoryRouter from "storybook-react-router";
import { storiesOf } from "@storybook/react";

import { EntityModalDecorator } from "utils/storybook";

import UserDetails from "containers/Admin/Users/UserDetails";

storiesOf("entities/User", module)
  .addDecorator(StoryRouter())
  .addDecorator(EntityModalDecorator("USER"))
  .add("User details", () => <UserDetails match={{ params: { userID: 1 } }} />);
