// @flow

import React, { useState } from "react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import { genUsers, genGroups, genWhitelists } from "data/mock-entities";
import MultiRules from "components/MultiRules";
import { serializeRulesSetsForPOST } from "components/MultiRules/helpers";
import Box from "components/base/Box";
import Button from "components/base/Button";
import initialRulesSets from "data/mock-governance-rules.json";
import { convertGovernanceRules } from "api/transformations/Account";

const BITCOIN = getCryptoCurrencyById("bitcoin");

const users = genUsers(15).map(u => ({ ...u, role: "OPERATOR" }));
const groups = genGroups(3, { users });
const whitelists = genWhitelists(10, { users });

initialRulesSets[0].rules[2].data[0].group = {
  is_internal: true,
  members: [users[0], users[1]],
};

initialRulesSets[0].rules[2].data[1].group = groups[0];
initialRulesSets[0].rules[2].data[2].group = groups[1];
initialRulesSets[0].rules[0].data.push(whitelists[0].id);

convertGovernanceRules(initialRulesSets);

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
  const [textMode, setTextMode] = useState(false);

  const serialized = serializeRulesSetsForPOST(rulesSets);
  return (
    <Box flow={20} align="flex-start">
      <MultiRules
        rulesSets={rulesSets}
        onChange={setRulesSets}
        users={users}
        groups={groups}
        whitelists={whitelists}
        readOnly={readOnly}
        textMode={textMode}
        currencyOrToken={BITCOIN}
      />
      <Button type="filled" onClick={() => setReadOnly(!readOnly)}>
        toggle read only
      </Button>
      <Button type="filled" onClick={() => setTextMode(!textMode)}>
        toggle text mode
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
