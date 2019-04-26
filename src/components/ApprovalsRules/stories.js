/* eslint-disable react/prop-types */

import React from "react";
import keyBy from "lodash/keyBy";
import { denormalize } from "normalizr-gre";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import schema from "data/schema";
import { genUsers, genGroups } from "data/mock-entities";

import ApprovalsRules from "components/ApprovalsRules";
import RulesViewer from "components/ApprovalsRules/RulesViewer";

const users = genUsers(20);
const groups = genGroups(2, { users });
const groupsActive = genGroups(2, { users, status: "ACTIVE" });
const allGroups = [...groups, ...groupsActive];
const denormalizedGroups = denormalize(
  allGroups.map(g => g.id),
  [schema.Group],
  {
    users: keyBy(users, "id"),
    groups: keyBy(allGroups, "id"),
  },
);

const tx_approval_steps = [
  { quorum: 1, group: denormalizedGroups[0] },
  { quorum: 2, group: denormalizedGroups[2] },
  { quorum: 2, group: denormalizedGroups[1] },
];
storiesOf("components", module).add("ApprovalsRules", () => <Wrapper />);
storiesOf("components", module).add("ApprovalsRulesViewer", () => (
  <RulesViewer rules={tx_approval_steps} />
));

class Wrapper extends React.Component {
  state = {
    approvalsRules: [{ quorum: 1, users: [], group: null }],
  };

  handleChangeApprovalsRules = approvalsRules => {
    this.setState(() => ({ approvalsRules }));
    action("onChange")(approvalsRules);
  };

  render() {
    const { approvalsRules } = this.state;
    return (
      <ApprovalsRules
        rules={approvalsRules}
        onChange={this.handleChangeApprovalsRules}
        users={users}
        groups={groups}
      />
    );
  }
}
