// @flow

import React from "react";
import { Trans, withTranslation } from "react-i18next";

import Box from "components/base/Box";
import { InputText, Label } from "components/base/form";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import InfoBox from "components/base/InfoBox";

import type { Translate, User } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {
  t: Translate,
};

export const MAX_MEMBERS = 20;

const GroupCreationInfos = (props: Props) => {
  const { payload, updatePayload, operators, t } = props;

  const listOperators = operators.edges.map(e => e.node);
  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });

  const handleChangeMembers = (data: { members: User[] }) =>
    updatePayload({ members: data.members });

  return (
    <Box flow={20}>
      <Box>
        <Label>{t("group:create.name_placeholder")}</Label>
        <InputText
          data-test="group_name"
          value={payload.name}
          autoFocus
          onChange={handleChangeName}
          maxLength={19}
          onlyAscii
          placeholder={t("group:create.name_placeholder")}
        />
      </Box>
      <Box>
        <Label>{t("group:create.desc_placeholder")}</Label>
        <InputText
          maxLength={255}
          data-test="group_description"
          value={payload.description}
          onChange={handleChangeDesc}
          placeholder={t("group:create.desc_placeholder")}
        />
      </Box>
      <Box justify="space-between" grow>
        <Box>
          <Label>
            <Trans i18nKey="group:membersTitle" />
          </Label>
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
            <Trans i18nKey="group:maxMembers" />
          </InfoBox>
        )}
      </Box>
    </Box>
  );
};

export default withTranslation()(GroupCreationInfos);
