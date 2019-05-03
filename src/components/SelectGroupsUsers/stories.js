/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import { genUsers } from "data/mock-entities";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import Text from "components/base/Text";
import Box from "components/base/Box";

const members = genUsers(10);
const group1 = { id: 1, name: "group A", members };
const group2 = { id: 2, name: "group B", members };

class Wrapper extends Component<> {
  state = {
    selected: { groups: [], members: [] },
  };

  onChange = val => {
    this.setState(_ => ({ selected: val }));
  };

  render() {
    const { selected } = this.state;
    const { mixed, onlyUser, onlyGroup } = this.props;
    if (mixed) {
      return (
        <SelectGroupsUsers
          groups={[group1, group2]}
          members={members}
          value={selected}
          onChange={this.onChange}
        />
      );
    }
    if (onlyUser) {
      return (
        <SelectGroupsUsers
          groups={[]}
          members={members}
          value={selected}
          onChange={this.onChange}
        />
      );
    }
    if (onlyGroup) {
      return (
        <SelectGroupsUsers
          groups={[group1, group2]}
          members={[]}
          value={selected}
          onChange={this.onChange}
        />
      );
    }
  }
}
storiesOf("components/form/selects", module).add("SelectGroupsUsers", () => (
  <>
    <Box p={20}>
      <Text uppercase>Groups and user</Text>
      <Wrapper mixed />
    </Box>
    <Box p={20}>
      <Text uppercase>Only groups</Text>
      <Wrapper onlyGroup />
    </Box>
    <Box p={20}>
      <Text uppercase>Only users</Text>
      <Wrapper onlyUser />
    </Box>
  </>
));
