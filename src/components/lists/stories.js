import React from "react";
import faker from "faker";
import capitalize from "lodash/capitalize";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import backendDecorator from "stories/backendDecorator";
import { RequestActivityTypeList } from "data/types";
import { RequestsList } from "components/lists";
import Box from "components/base/Box";
import { genAccounts, genUsers, genRequest } from "data/mock-entities";

const users = genUsers(1);
const accounts = genAccounts(1, { users });
const requests = genAllRequests();
const noop = () => {};

storiesOf("entities/Request", module)
  .addDecorator(
    backendDecorator([
      {
        url: "/accounts/1",
        res: () => accounts[0],
      },
    ]),
  )
  .addDecorator(pageDecorator)
  .add("Requests list", () => {
    const firstPack = requests.slice(0, 6);
    const secondPack = requests.slice(6);
    return (
      <Box horizontal flow={20}>
        <div style={{ width: 500 }}>
          <RequestsList requests={firstPack} onRequestClick={noop} />
        </div>
        <div style={{ width: 500 }}>
          <RequestsList requests={secondPack} onRequestClick={noop} />
        </div>
      </Box>
    );
  });

function genAllRequests(status = "PENDING_APPROVAL") {
  return RequestActivityTypeList.map(type => {
    const r = Object.assign(genRequest(type, { status }), {
      current_step: 0,
      created_by: { username: "Dany Brillant" },
      approvals_steps: [{ quorum: 5, group: { members: [] } }],
      approvals: [
        {
          created_by: { username: "Admin 1" },
          created_on: "2019-06-18T10:50:29.355723+00:00",
          step: 0,
          type: "APPROVE",
        },
      ],
      ...getRequestExtra(type),
    });
    return r;
  });
}

function getRequestExtra(type) {
  if (["REVOKE_USER", "CREATE_ADMIN", "CREATE_OPERATOR"].includes(type)) {
    return { user: { username: faker.name.findName() } };
  }
  if (["CREATE_GROUP", "EDIT_GROUP", "REVOKE_GROUP"].includes(type)) {
    return { group: { name: faker.commerce.productName() } };
  }
  if (
    [
      "CREATE_ACCOUNT",
      "EDIT_ACCOUNT",
      "REVOKE_ACCOUNT",
      "MIGRATE_ACCOUNT",
    ].includes(type)
  ) {
    return { account: { name: capitalize(faker.company.bsAdjective()) } };
  }
  if (type === "CREATE_TRANSACTION") {
    return { transaction: { account_id: 1 } };
  }
  return {};
}
