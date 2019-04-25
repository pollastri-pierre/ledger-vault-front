// @flow

import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { storiesOf } from "@storybook/react";
import { FaUsers } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import StoryRouter from "storybook-react-router";

import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";
import { Breadcrumb, BreadcrumbContainer } from "components/base/Breadcrumb";
import ConnectedBreadcrumb from "components/ConnectedBreadcrumb";
import Box from "components/base/Box";

const cur = getCryptoCurrencyById("bitcoin");
const CurIconSrc = getCryptoCurrencyIcon(cur);

const CurIcon = () => (
  // $FlowFixMe
  <CurIconSrc size={12} color={cur.color} />
);

const connectedBreadcrumbConfig = [
  {
    path: "",
    render: p => p.user.role,
    children: [
      { path: "/", render: "Dashboard", exact: true },
      {
        path: "/accounts",
        render: "Accounts",
        children: [
          {
            path: "/accounts/:id",
            render: "Yo",
            children: [
              { path: "/accounts/:id/settings", render: "Yo settings" },
            ],
          },
        ],
      },
    ],
  },
];

export const BreadcrumbExample = () => (
  <BreadcrumbContainer>
    <Breadcrumb Icon={FaUsers}>Accounts</Breadcrumb>
    <Breadcrumb Icon={CurIcon}>Bitcoin 1</Breadcrumb>
    <Breadcrumb>Account settings</Breadcrumb>
  </BreadcrumbContainer>
);

storiesOf("base", module).add("Breadcrumb", () => <BreadcrumbExample />);

const FakeURL = withRouter(({ location }) => <div>{location.pathname}</div>);

storiesOf("other", module)
  .addDecorator(StoryRouter())
  .add("ConnectedBreadcrumb", () => (
    <Box flow={40}>
      <FakeURL />
      <ConnectedBreadcrumb
        config={connectedBreadcrumbConfig}
        additionalProps={{
          user: { role: "Administrator" },
          accounts: [],
        }}
      />
      <Box horizontal flow={10}>
        <Link to="/">Dashboard</Link>
        <Link to="/accounts">Accounts</Link>
        <Link to="/accounts/5">Account 5</Link>
        <Link to="/accounts/5/settings">Account 5 settings</Link>
      </Box>
    </Box>
  ));
