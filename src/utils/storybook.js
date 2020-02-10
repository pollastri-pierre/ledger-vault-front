/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { denormalize } from "normalizr-gre";
import RestlayProvider from "restlay/RestlayProvider";
import schema from "data/schema";
import keyBy from "lodash/keyBy";

import { Checkbox } from "components/base/form";
import Box from "components/base/Box";
import Select from "components/base/Select";
import Modal from "components/base/Modal";
import Text from "components/base/Text";
import { delay } from "utils/promise";
import { organization } from "stories/backendDecorator";
import {
  genUsers,
  genWhitelists,
  genGroups,
  genAccounts,
  genTransactions,
  genRequest,
} from "data/mock-entities";
import UserContextProvider from "components/UserContextProvider";
import { OrganizationContextProvider } from "components/OrganizationContext";

const users = genUsers(20);
const admin = users.find(u => u.role === "ADMIN");
const groups = genGroups(3, { users, status: "ACTIVE" });
const accounts = genAccounts(4);
const whitelists = genWhitelists(10, { users });
const transactions = genTransactions(1, { accounts, users });

const defaultHistory = [
  {
    approvals: [
      {
        created_by: {
          created_on: "2019-04-29T07:08:20.402527+00:00",
          username: "Admin 3",
        },
        created_on: "2019-04-29T07:11:24.409085+00:00",
        type: "APPROVE",
      },
      {
        created_by: {
          created_on: "2019-04-29T07:08:18.425364+00:00",
          username: "Admin 2",
        },
        created_on: "2019-04-29T07:10:58.117044+00:00",
        type: "APPROVE",
      },
    ],
    created_by: {
      created_on: "2019-04-29T07:08:18.425364+00:00",
      username: "Admin 2",
    },
    created_on: "2019-04-29T07:10:56.669871+00:00",
    status: "PENDING_APPROVAL",
    type: "CREATE_",
  },
  {
    created_by: {
      created_on: "2019-04-29T07:08:20.402527+00:00",
      username: "Admin 3",
    },
    created_on: "2019-04-29T07:11:24.492963+00:00",
    status: "APPROVED",
    type: "CREATE_",
  },
];

const wrapWithRequest = ({ request_type, approved, entity }) => {
  const last_request = genRequest();
  const ent = { ...entity, last_request };
  ent.last_request.status = request_type ? "PENDING" : "APPROVED";
  ent.last_request.type = (request_type && request_type.value) || "CREATE_";
  ent.last_request.approvals = approved
    ? [{ created_by: users[0], type: "APPROVE" }]
    : [];
  ent.status = "ACTIVE";
  return ent;
};

const getFakeNetwork = ({ request_type, approved }) => async url => {
  await delay(500);
  if (url === "/organization") {
    return {
      quorum: 2,
    };
  }
  // GET /people/:id
  if (url.startsWith("/people?role=")) {
    return wrapConnection(users);
  }

  if (/^\/people\/([^/]+)$/.exec(url)) {
    return wrapWithRequest({ entity: users[0], request_type, approved });
  }
  if (url.match(/\/transactions\/.*\/account$/)) {
    return {
      transaction: wrapWithRequest({
        entity: transactions[0],
        request_type,
        approved,
      }),
      account: accounts[0],
    };
  }
  if (url.startsWith("/transactions")) {
    return wrapConnection(transactions);
  }
  if (/^\people$/.exec(url) || url.startsWith("/people?groupId")) {
    return wrapConnection(users);
  }
  if (url.match(/groups\/[^/]*\/accounts/g)) {
    return accounts;
  }
  if (url.match(/[^/]*\/[^/]*\/history/g)) {
    if (request_type && !request_type.value.startsWith("CREATE_")) {
      return [
        ...defaultHistory,
        {
          approvals: [
            {
              created_by: {
                created_on: "2019-04-29T07:08:22.402527+00:00",
                username: "Admin 3",
              },
              created_on: "2019-04-29T07:11:24.409085+00:00",
              type: "APPROVE",
            },
          ],
          created_by: { username: "Admin 3" },
          created_on: "2019-04-29T07:08:20.402527+00:00",
          status: "PENDING_APPROVAL",
          type: request_type.value,
        },
      ];
    }
    return defaultHistory;
  }
  if (url.match(/whitelists\/[^/]*/g)) {
    return whitelists[0];
  }
  if (url.match(/accounts\/[^/]*/g)) {
    const account = accounts[0];

    // FIXME we need a coherent governance_rules in the account
    //       before, we used to do this:
    //
    // account.tx_approval_steps.forEach((rule, i) => {
    //   const a = denormalize(rule.group, schema.Group, {
    //     users: keyBy(users, "id"),
    //   });
    //   account.tx_approval_steps[i].group = a;
    // });

    return wrapWithRequest({ entity: account, request_type, approved });
  }
  if (url.startsWith("/groups")) {
    const group = denormalize(
      groups.map(g => g.id),
      [schema.Group],
      {
        users: keyBy(users, "id"),
        groups: keyBy(groups, "id"),
      },
    )[0];
    return wrapWithRequest({ entity: group, request_type, approved });
  }
  throw new Error(`invalid url ${url}`);
};

const Inner = ({ story, entity }) => {
  const [hasApproved, setHasApproved] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const onCheckboxClick = () => {
    setHasApproved(!hasApproved);
  };
  const onRequest = val => {
    setPendingRequest(val);
  };

  const options = [
    { value: `EDIT_${entity}`, label: `EDIT` },
    { value: `REVOKE_${entity}`, label: `REVOKE` },
    { value: `CREATE_${entity}`, label: `CREATE` },
  ];

  const network = getFakeNetwork({
    request_type: pendingRequest,
    approved: hasApproved,
  });

  return (
    <RestlayProvider network={network}>
      <OrganizationContextProvider
        value={{ organization, refresh: () => Promise.resolve() }}
      >
        <UserContextProvider me={admin}>
          <Box
            horizontal
            align="center"
            flow={20}
            p={20}
            justify="center"
            style={{
              borderRadius: 5,
              position: "fixed",
              top: 25,
              left: 25,
              background: "white",
              zIndex: 3,
            }}
          >
            <Box width={200}>
              <Select
                options={options}
                isClearable
                placeholder="with pending"
                value={pendingRequest}
                onChange={onRequest}
              />
            </Box>
            {pendingRequest && (
              <Box horizontal align="center" onClick={onCheckboxClick}>
                <Text>approved ?</Text>
                <Checkbox checked={hasApproved} />
              </Box>
            )}
          </Box>
          <Modal
            transparent
            isOpened
            key={JSON.stringify({ pendingRequest, hasApproved })}
          >
            {story()}
          </Modal>
        </UserContextProvider>
      </OrganizationContextProvider>
    </RestlayProvider>
  );
};
export const EntityModalDecorator = entity => story => {
  return <Inner story={story} entity={entity} />;
};

function wrapConnection(data) {
  return {
    edges: data.map(d => ({ node: d, cursor: d.id })),
    pageInfo: { hasNextPage: false },
  };
}
