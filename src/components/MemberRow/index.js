// @flow
import React, { Component } from "react";
import type { Member } from "data/types";
import colors from "shared/colors";
import styled from "styled-components";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Checkbox from "../form/Checkbox";

const Container = styled(Box)`
  border-bottom: 1px solid ${colors.argile};
  &:last-child {
    border: 0;
  }
`;
class MemberRow extends Component<{
  onSelect?: (pub_key: string) => void,
  checked?: boolean,
  editable?: boolean,
  member: Member
}> {
  onClick = () => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(this.props.member.pub_key);
  };

  render() {
    const { member, onSelect, checked, editable } = this.props;
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
        {editable && (
          <Text small color={colors.steel} i18nKey="common:clickToEdit" />
        )}
        {onSelect &&
          !editable && (
            <Checkbox
              checked={checked}
              labelFor={member.id}
              handleInputChange={this.onClick}
            />
          )}
      </Container>
    );
  }
}

export default MemberRow;
