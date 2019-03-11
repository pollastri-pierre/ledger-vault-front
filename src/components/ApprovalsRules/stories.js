/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { genMembers, genGroups } from "data/mock-entities";

import ApprovalsRules from "components/ApprovalsRules";

const members = genMembers(10);
const groups = genGroups(2, { members });

storiesOf("other", module).add("ApprovalsRules", () => <Wrapper />);

class Wrapper extends React.Component {
  state = {
    approvalsRules: [{ quorum: 1, users: [], group: null }]
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
        users={members}
        groups={groups}
      />
    );
  }
}
