// @flow

import React from "react";
import styled from "styled-components";
import { FaQuestionCircle, FaPowerOff } from "react-icons/fa";

import colors from "shared/colors";
import type { User } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { vaultLayoutConfig } from "styles/theme";
import { urlByRole } from "components/HelpLink";

type Props = {
  user: User,
  onLogout: () => void,
};

export default ({ user, onLogout }: Props) => {
  return (
    <VaultLayoutTopBar>
      <VaultLayoutTopBarRight>
        <Box horizontal align="center" px={20}>
          <Text small>{user.username}</Text>
        </Box>
        <TopBarAction link={urlByRole[user.role]} Icon={FaQuestionCircle} />
        <TopBarAction data-test="logout" Icon={FaPowerOff} onClick={onLogout} />
      </VaultLayoutTopBarRight>
    </VaultLayoutTopBar>
  );
};

const VaultLayoutTopBar = styled.div`
  flex-shrink: 0;
  display: flex;
  position: relative;
  align-items: center;
  padding: 0 20px;
  height: ${vaultLayoutConfig.TOP_BAR_HEIGHT}px;
  background: white;
  box-shadow: 0 -2px 5px 0 ${colors.legacyTranslucentGrey2};
`;

const VaultLayoutTopBarRight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  line-height: 1;
  display: flex;
`;

const TopBarActionComponent = styled.div`
  cursor: pointer;
  color: ${colors.legacyGrey};
  display: flex;
  align-items: center;

  padding-left: ${p => (p.link ? "0" : "10px")};
  padding-right: ${p => (p.link ? "0" : "10px")};

  &:hover {
    color: ${colors.textLight};
  }

  &:active {
    background-color: ${colors.form.bg};
  }

  a {
    color: inherit;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: ${p => (p.link ? "10px" : "0")};
    padding-right: ${p => (p.link ? "10px" : "0")};
  }
`;

const TopBarAction = ({
  link,
  onClick,
  Icon,
  ...props
}: {
  link?: string,
  Icon: React$ComponentType<*>,
  onClick?: () => void,
}) => {
  let inner = <Icon size={18} />;
  if (link) {
    inner = (
      <a href={link} target="new">
        {inner}
      </a>
    );
  }
  return (
    <TopBarActionComponent onClick={onClick} link={link} {...props}>
      {inner}
    </TopBarActionComponent>
  );
};
