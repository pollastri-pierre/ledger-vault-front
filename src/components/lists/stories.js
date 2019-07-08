import React from "react";
import { storiesOf } from "@storybook/react";

import { genRequest } from "data/mock-entities";
import { RequestActivityTypeList } from "data/types";
import { RequestsList } from "components/lists";

const requests = genAllRequests();

storiesOf("entities/Request", module)
  .addDecorator(decorator)
  .add("Requests list", () => <RequestsList requests={requests} />);

function genAllRequests(status = "PENDING_APPROVAL") {
  return RequestActivityTypeList.map(type => genRequest(type, { status }));
}

function decorator(story) {
  return (
    <div
      style={{
        position: "fixed",
        background: "#fafafa",
        overflow: "auto",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 40,
      }}
    >
      {story()}
    </div>
  );
}
