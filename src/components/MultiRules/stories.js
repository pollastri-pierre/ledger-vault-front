// @flow

import React, { useState } from "react";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import { genUsers, genGroups } from "data/mock-entities";
import MultiRules from "components/MultiRules";
import { serializeRulesSetsForPOST } from "components/MultiRules/helpers";
import Box from "components/base/Box";
import Button from "components/base/Button";
import initialRulesSets from "data/mock-governance-rules.json";

const users = genUsers(15).map(u => ({ ...u, role: "operator" }));
const groups = genGroups(3, { users });

initialRulesSets[0].rules[1].data[0].group = {
  is_internal: true,
  members: [users[0], users[1]],
};

initialRulesSets[0].rules[1].data[1].group = groups[0];
initialRulesSets[0].rules[1].data[2].group = groups[1];

/* eslint-disable no-unused-vars */
const emptyRulesSets = [
  {
    name: "Rule 1",
    rules: [
      {
        type: "MULTI_AUTHORIZATIONS",
        data: [],
      },
    ],
  },
];
/* eslint-enable no-unused-vars */

storiesOf("components", module)
  .addDecorator(pageDecorator)
  .add("MultiRules", () => <Wrapper />);

const Wrapper = () => {
  const [rulesSets, setRulesSets] = useState(initialRulesSets);
  const [readOnly, setReadOnly] = useState(false);
  const serialized = serializeRulesSetsForPOST(rulesSets);
  return (
    <Box flow={20} align="flex-start">
      <MultiRules
        rulesSets={rulesSets}
        onChange={setRulesSets}
        users={users}
        groups={groups}
        readOnly={readOnly}
      />
      <Button type="filled" onClick={() => setReadOnly(!readOnly)}>
        toggle read only
      </Button>
      <Box>
        <pre
          style={{
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            userSelect: "text",
          }}
        >
          {JSON.stringify(serialized, null, 2)}
        </pre>
      </Box>
    </Box>
  );
};
