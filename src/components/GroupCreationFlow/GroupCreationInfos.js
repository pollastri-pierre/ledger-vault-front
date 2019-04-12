// @flow

import React from "react";
import { translate } from "react-i18next";

import Box from "components/base/Box";
import Disabled from "components/Disabled";
import { InputText, Label } from "components/base/form";

import type { Translate } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {
  t: Translate,
};

const GroupCreationInfos = (props: Props) => {
  const { payload, updatePayload, t, isEditMode } = props;

  const handleChangeName = (name: string) => updatePayload({ name });
  const handleChangeDesc = (description: string) =>
    updatePayload({ description });

  return (
    <Disabled disabled={isEditMode}>
      <Box flow={20}>
        <Box>
          <Label>{t("group:create.name_placeholder")}</Label>
          <InputText
            value={payload.name}
            autoFocus
            disabled={isEditMode}
            onChange={handleChangeName}
            maxLength={19}
            onlyAscii
            placeholder={t("group:create.name_placeholder")}
          />
        </Box>
        <Box>
          <Label>{t("group:create.desc_placeholder")}</Label>
          <InputText
            value={payload.description}
            disabled={isEditMode}
            onChange={handleChangeDesc}
            placeholder={t("group:create.desc_placeholder")}
          />
        </Box>
      </Box>
    </Disabled>
  );
};

export default translate()(GroupCreationInfos);
