// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import Box from "components/base/Box";
import { maxLengthNonAsciiHints } from "components/base/hints";
import { InputText, Label, Form, TextArea } from "components/base/form";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import InfoBox from "components/base/InfoBox";

import type { User } from "data/types";
import type { GroupCreationStepProps } from "./types";

export const MAX_MEMBERS = 20;
const GROUP_NAME_LENGTH = 19;

export default function GroupCreationInfos(props: GroupCreationStepProps) {
  const { t } = useTranslation();
  const { payload, updatePayload, operators, onEnter } = props;

  const listOperators = operators.edges.map((e) => e.node);
  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });

  const handleChangeMembers = (data: { members: User[] }) =>
    updatePayload({ members: data.members });
  const inner = (
    <Box flow={20}>
      <Box>
        <Label>{t("group:create.name_placeholder")}</Label>
        <InputText
          data-test="group_name"
          value={payload.name}
          autoFocus
          onChange={handleChangeName}
          maxLength={GROUP_NAME_LENGTH}
          onlyAscii
          hints={maxLengthNonAsciiHints(GROUP_NAME_LENGTH)}
          placeholder={t("group:create.name_placeholder")}
        />
      </Box>
      <Box>
        <Label>{t("group:create.desc_placeholder")}</Label>
        <TextArea
          data-test="group_description"
          value={payload.description}
          onChange={handleChangeDesc}
          placeholder={t("group:create.desc_placeholder")}
        />
      </Box>
      <Box justify="space-between" grow>
        <Box>
          <Label>{t("group:membersTitle")}</Label>
          <SelectGroupsUsers
            openMenuOnFocus
            members={listOperators}
            value={{ members: payload.members, group: [] }}
            onChange={handleChangeMembers}
            hasReachMaxLength={payload.members.length === MAX_MEMBERS}
          />
        </Box>
        {payload.members.length === MAX_MEMBERS && (
          <InfoBox withIcon type="info">
            {t("group:maxMembers")}
          </InfoBox>
        )}
      </Box>
    </Box>
  );
  return <Form onSubmit={onEnter}>{inner}</Form>;
}
