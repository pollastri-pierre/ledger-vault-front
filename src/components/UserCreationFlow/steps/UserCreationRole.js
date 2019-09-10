// @flow

import React from "react";
import styled from "styled-components";
import ButtonBase from "@material-ui/core/ButtonBase";

import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import AdminIcon from "components/icons/AdminIcon";
import OperatorIcon from "components/icons/OperatorIcon";
import type { UserCreationStepProps } from "../types";

export default (props: UserCreationStepProps) => {
  const { payload, updatePayload, transitionTo } = props;
  const { role } = payload;

  const chooseRoleAndNext = role => () => {
    updatePayload({ role }, () => {
      transitionTo("infos");
    });
  };

  return (
    <Box>
      <Box pt={50} horizontal align="center" justify="center" flow={20}>
        <Choice
          data-test="new_admin"
          isActive={role === "ADMIN"}
          onClick={chooseRoleAndNext("ADMIN")}
        >
          <Box flow={10}>
            <Title>
              <Text bold i18nKey="inviteUser:steps.role.admin.title" />
              <AdminIcon color={colors.green} size={20} />
            </Title>
            <Text
              small
              color={colors.mediumGrey}
              i18nKey="inviteUser:steps.role.admin.desc"
            />
          </Box>
        </Choice>
        <Choice
          isActive={role === "OPERATOR"}
          data-test="new_operator"
          onClick={chooseRoleAndNext("OPERATOR")}
        >
          <Box flow={10}>
            <Title>
              <Text bold i18nKey="inviteUser:steps.role.operator.title" />
              <OperatorIcon color={colors.ocean} size={20} />
            </Title>
            <Text
              small
              color={colors.mediumGrey}
              i18nKey="inviteUser:steps.role.operator.desc"
            />
          </Box>
        </Choice>
      </Box>
    </Box>
  );
};

const Choice = styled(({ isActive, ...p }) => <ButtonBase {...p} />)`
  && {
    display: block;
    background: ${p =>
      p.isActive ? opacity(colors.ocean, 0.05) : colors.white};
    border: 2px solid
      ${p => (p.isActive ? opacity(colors.ocean, 0.4) : colors.argile)};
    width: 210px;
    height: 210px;
    padding: 20px;
    padding-top: 30px;
    border-radius: 4px;
  }
`;

const Title = styled(Box).attrs({
  horizontal: true,
  align: "center",
  justify: "center",
  flow: 5,
})`
  position: absolute;
  top: 50px;
  left: 60px;
`;
