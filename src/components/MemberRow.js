// @flow
import React, { Component } from "react";
import type { User } from "data/types";
import colors from "shared/colors";
import styled from "styled-components";
import Box from "components/base/Box";
import Text from "components/base/Text";

const Container = styled(Box)`
  border-bottom: 1px solid ${colors.argile};
  &:last-child {
    border: 0;
  }
`;
class MemberRow extends Component<{
  onSelect?: (pub_key: string) => void,
  member: User,
}> {
  onClick = () => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(this.props.member.pub_key);
  };

  render() {
    const { member } = this.props;
    return (
      <Container
        horizontal
        justify="space-between"
        onClick={this.onClick}
        p={15}
      >
        <Box grow>
          <Text color={colors.black}>{member.username}</Text>
          <Text color={colors.steel}>{member.role || "Administrator"}</Text>
        </Box>
      </Container>
    );
  }
}

export default MemberRow;
