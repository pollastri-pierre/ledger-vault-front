// @flow
import React, { Component } from "react";
import { FaUser } from "react-icons/fa";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { User } from "data/types";

const userIcon = <FaUser size={10} />;

class MemberName extends Component<{
  member: User,
}> {
  render() {
    const { member, ...props } = this.props;

    return (
      <Box horizontal align="center" flow={8} {...props}>
        {userIcon}
        <Text>{member.username}</Text>
      </Box>
    );
  }
}

export default MemberName;
