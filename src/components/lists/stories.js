import React from "react";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import backendDecorator from "stories/backendDecorator";
import { genRequest } from "data/mock-entities";
import { RequestActivityTypeList } from "data/types";
import { RequestsList } from "components/lists";
import Box from "components/base/Box";

const requests = genAllRequests();
const noop = () => {};

storiesOf("entities/Request", module)
  .addDecorator(backendDecorator([]))
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
    });
    return r;
  });
}
