// @flow

import React from "react";
import qs from "query-string";
import isRegExp from "lodash/isRegExp";
import { delay } from "utils/promise";

import RestlayProvider from "restlay/RestlayProvider";
import { OrganizationContextProvider } from "components/OrganizationContext";
import UserContextProvider from "components/UserContextProvider";

type Mock = {
  url: string | RegExp,
  res: (wrap: (any) => any, params: Object) => any,
};

function wrapConnection(nodes: Array<any>) {
  return {
    edges: nodes.map(node => ({ node })),
    pageInfo: { hasNextPage: false },
  };
}

const organization = {
  name: "Legit",
  domain_name: "legit",
  workspace: "legit",
  number_of_admins: 4,
  quorum: 2,
};

const me = {
  id: 5,
  pub_key: "abcd",
  username: "Vaulty",
  created_on: "2019-01-01",
  status: "ACTIVE",
  role: "ADMIN",
};

export default function backendDecorator(mocks: Mock[]) {
  return (story: () => any) => {
    const mockNetwork = async url => {
      await delay(500);

      const queryParams = qs.parse(url.substr(url.indexOf("?")));

      for (const mock of mocks) {
        if (match(mock, url)) {
          return mock.res(wrapConnection, queryParams);
        }
      }
      throw new Error(`Couldnt find mock route for ${url}`);
    };

    return (
      <RestlayProvider network={mockNetwork}>
        <OrganizationContextProvider
          value={{ organization, refresh: () => Promise.resolve() }}
        >
          <UserContextProvider me={me}>{story()}</UserContextProvider>
        </OrganizationContextProvider>
      </RestlayProvider>
    );
  };
}

function match(mock, url) {
  if (isRegExp(mock.url) && mock.url.test(url)) return true;
  return url === mock.url;
}
