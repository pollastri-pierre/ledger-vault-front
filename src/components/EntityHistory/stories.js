/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import RestlayProvider from "restlay/RestlayProvider";
import EntityHistory from "components/EntityHistory";

// TODO: be able to generate this kind of history
export const mockUserHistory = [
  {
    created_by: {
      username: "Admin 1",
    },
    created_on: "2019-03-25T09:45:51.863758+00:00",
    status: "PENDING_REGISTRATION",
    type: "CREATE_OPERATOR",
  },
  {
    approvals: [
      {
        created_by: {
          username: "Admin 2",
        },
        created_on: "2019-03-25T09:46:32.652534+00:00",
        type: "ABORT",
      },
      {
        created_by: {
          username: "Admin 1",
        },
        created_on: "2019-03-25T09:46:12.815351+00:00",
        type: "APPROVE",
      },
    ],
    created_by: {
      username: "Admin 1",
    },
    created_on: "2019-03-25T09:46:03.841531+00:00",
    status: "PENDING_APPROVAL",
    type: "CREATE_OPERATOR",
  },
  {
    created_by: {
      username: "Admin 2",
    },
    created_on: "2019-03-25T09:46:32.673263+00:00",
    status: "APPROVE",
    type: "CREATE_OPERATOR",
  },
];

const mockNetwork = async url => {
  if (url === "/organization") {
    return {
      quorum: 2,
    };
  }
  throw new Error("unknown url");
};

storiesOf("components", module).add("EntityHistory", () => (
  <RestlayProvider network={mockNetwork}>
    <EntityHistory quorum={2} history={mockUserHistory} />
  </RestlayProvider>
));
