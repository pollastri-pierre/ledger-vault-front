// @flow

import React from "react";
import { withTranslation } from "react-i18next";

import Box from "components/base/Box";
import { InputText, Label } from "components/base/form";

import type { Translate } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {
  t: Translate,
};

const GroupCreationInfos = (props: Props) => {
  const { payload, updatePayload, t } = props;

  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });

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
    </Box>
  );
};

export default withTranslation()(GroupCreationInfos);
